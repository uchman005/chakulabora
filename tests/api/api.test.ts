/**
 * API regression suite: exercises every App Router route handler (and the NextAuth
 * credentials `authorize`) against a real in-memory MongoDB, asserting the same
 * request/response contracts the Pages Router version (archive/v1) had.
 */
import { beforeAll, describe, expect, test } from "bun:test";
import bcrypt from "bcrypt";
import { clearMail, ctx, json, jsonRequest, sentMail } from "../helpers";

import { dbCon } from "@/models";
import { authOptions } from "@/lib/auth";
import { getAnswersForPost, getApprovedPosts, getPostByBlob, plainText } from "@/lib/posts";
import { displayName } from "@/lib/user";

import * as usersCreate from "@/app/api/users/create/route";
import * as usersContact from "@/app/api/users/contact/route";
import * as usersForgot from "@/app/api/users/forgotpassword/route";
import * as usersReset from "@/app/api/users/reset-password/route";
import * as usersSubscribe from "@/app/api/users/subscribe-email/route";
import * as usersUpdatePassword from "@/app/api/users/updatepassword/route";
import * as usersValidate from "@/app/api/users/validate-reset-token/route";
import * as userCount from "@/app/api/[user]/count/route";
import * as userDelete from "@/app/api/[user]/delete/route";
import * as userUpdate from "@/app/api/[user]/update/route";
import * as userGet from "@/app/api/[user]/user/route";
import * as postsApprove from "@/app/api/posts/approve/route";
import * as postsCreate from "@/app/api/posts/create/route";
import * as postsDislike from "@/app/api/posts/dislike/route";
import * as postsFind from "@/app/api/posts/find/route";
import * as postsLike from "@/app/api/posts/like/route";
import * as postsOne from "@/app/api/posts/[post]/route";
import * as postsReject from "@/app/api/posts/reject/route";
import * as postsUnapproved from "@/app/api/posts/unapproved/route";
import * as answersCreate from "@/app/api/answers/create/route";
import * as answersDislike from "@/app/api/answers/dislike/route";
import * as answersById from "@/app/api/answers/[id]/route";
import * as answersLike from "@/app/api/answers/like/route";

type Authorize = (credentials: Record<string, string> | undefined, req: unknown) => Promise<{ id: string; email: string } | null>;
const authorize: Authorize = (authOptions.providers.find((p) => p.id === "credentials") as unknown as {
  options: { authorize: Authorize };
}).options.authorize;

const createUser = (body: Record<string, unknown>) => json(usersCreate.POST(jsonRequest("/api/users/create", body)));

beforeAll(async () => {
  const { User, Post, Answer, Subscriber, Contact } = await dbCon();
  // Build unique indexes up front (production databases already have them).
  await Promise.all([User.init(), Post.init(), Answer.init(), Subscriber.init(), Contact.init()]);
});

// ---------------------------------------------------------------------------
describe("users: signup", () => {
  test("only email + password are required (names optional)", async () => {
    const { status, body } = await createUser({ email: "minimal@example.com", password: "secret1" });
    expect(status).toBe(200);
    expect(body).toMatchObject({ email: "minimal@example.com" });
    expect(body._id).toBeString();
    expect(body.password).toBeUndefined();

    const { User } = await dbCon();
    const doc = await User.findById(body._id).lean<Record<string, unknown>>();
    expect(doc?.role).toBe("Community Member");
    expect(doc?.pv).toBe(0);
    expect(doc?.fname).toBeUndefined();
    expect(await bcrypt.compare("secret1", doc?.password as string)).toBe(true);
  });

  test("full signup keeps names (trimmed)", async () => {
    const { body } = await createUser({ email: "ada@example.com", password: "pw-ada", fname: " Ada ", lname: "Obi" });
    expect(body).toMatchObject({ email: "ada@example.com", fname: "Ada", lname: "Obi" });
  });

  test("duplicate email returns null (client shows 'login instead')", async () => {
    const { status, body } = await createUser({ email: "ada@example.com", password: "x" });
    expect(status).toBe(200);
    expect(body).toBeNull();
  });

  test("missing password returns null instead of crashing", async () => {
    const { body } = await createUser({ email: "nopass@example.com" });
    expect(body).toBeNull();
  });
});

describe("auth: credentials authorize", () => {
  test("valid credentials return the Mongo id as id and email", async () => {
    const { User } = await dbCon();
    const ada = await User.findOne({ email: "ada@example.com" });
    const result = await authorize({ email: "ada@example.com", password: "pw-ada" }, {});
    expect(result).toEqual({ id: String(ada!._id), email: String(ada!._id) });
  });

  test("wrong password throws the original message", async () => {
    await expect(authorize({ email: "ada@example.com", password: "nope" }, {})).rejects.toThrow("Password did not Match user Password");
  });

  test("unknown email throws the original message", async () => {
    await expect(authorize({ email: "ghost@example.com", password: "x" }, {})).rejects.toThrow(/User not found/);
  });

  test("missing fields are rejected", async () => {
    await expect(authorize({ email: "", password: "" }, {})).rejects.toThrow(/required/);
  });

  test("Google-only account (no password) cannot sign in with credentials", async () => {
    const { User } = await dbCon();
    await User.create({ email: "google@example.com", googleId: "g-1" });
    await expect(authorize({ email: "google@example.com", password: "anything" }, {})).rejects.toThrow();
  });
});

// ---------------------------------------------------------------------------
describe("users: profile", () => {
  let adaId: string;
  beforeAll(async () => {
    const { User } = await dbCon();
    adaId = String((await User.findOne({ email: "ada@example.com" }))!._id);
  });

  test("GET /api/[user]/user never exposes password or reset token", async () => {
    const { User } = await dbCon();
    await User.updateOne({ _id: adaId }, { resetPasswordToken: "tok", resetPasswordExpires: new Date(Date.now() + 1e6) });
    const { status, body } = await json(userGet.GET(jsonRequest(`/api/${adaId}/user`), ctx({ user: adaId })));
    expect(status).toBe(200);
    expect(body.email).toBe("ada@example.com");
    expect(body.password).toBeUndefined();
    expect(body.resetPasswordToken).toBeUndefined();
    await User.updateOne({ _id: adaId }, { $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 } });
  });

  test("GET with a malformed id returns 400", async () => {
    const { status } = await json(userGet.GET(jsonRequest("/api/nope/user"), ctx({ user: "nope" })));
    expect(status).toBe(400);
  });

  test("POST /api/[user]/update saves profile fields", async () => {
    const update = {
      fname: "Ada",
      lname: "Lovelace",
      email: "ada@example.com",
      bio: "Farmer",
      city: "Nairobi",
      country: "Kenya",
      website: "ada.farm",
      state: "",
      postal_code: "00100",
      street_address: "Moi Ave",
    };
    const { body } = await json(userUpdate.POST(jsonRequest(`/api/${adaId}/update`, update), ctx({ user: adaId })));
    expect(body).toMatchObject({ lname: "Lovelace", city: "Nairobi", country: "Kenya" });
    expect(body.password).toBeUndefined();
  });

  test("profile update works with names cleared (now optional)", async () => {
    const { body } = await json(
      userUpdate.POST(jsonRequest(`/api/${adaId}/update`, { email: "ada@example.com", fname: "", lname: "" }), ctx({ user: adaId }))
    );
    expect(body).not.toBeNull();
    await userUpdate.POST(jsonRequest(`/api/${adaId}/update`, { email: "ada@example.com", fname: "Ada", lname: "Lovelace" }), ctx({ user: adaId }));
  });

  test("updatepassword accepts the shape the client sends ({ id, password }) — was broken in v1", async () => {
    const { body } = await json(usersUpdatePassword.POST(jsonRequest("/api/users/updatepassword", { id: adaId, password: "new-pw" })));
    expect(body).toBe(true);
    expect(await authorize({ email: "ada@example.com", password: "new-pw" }, {})).toMatchObject({ id: adaId });
  });

  test("updatepassword still accepts the legacy { data: { id, password } } shape", async () => {
    const { body } = await json(usersUpdatePassword.POST(jsonRequest("/api/users/updatepassword", { data: { id: adaId, password: "pw-ada" } })));
    expect(body).toBe(true);
  });

  test("updatepassword with missing fields returns false", async () => {
    const { body } = await json(usersUpdatePassword.POST(jsonRequest("/api/users/updatepassword", {})));
    expect(body).toBe(false);
  });
});

// ---------------------------------------------------------------------------
describe("users: password reset flow", () => {
  let token: string;

  test("forgotpassword: unknown email", async () => {
    const { body } = await json(usersForgot.POST(jsonRequest("/api/users/forgotpassword", { email: "ghost@example.com" })));
    expect(body).toEqual({ success: false, message: "User not found" });
  });

  test("forgotpassword: known email stores a token and emails the user", async () => {
    clearMail();
    const { body } = await json(usersForgot.POST(jsonRequest("/api/users/forgotpassword", { email: "ada@example.com" })));
    expect(body).toEqual({ success: true, message: "Password reset email sent" });
    const { User } = await dbCon();
    const ada = await User.findOne({ email: "ada@example.com" });
    token = ada!.resetPasswordToken as string;
    expect(token).toMatch(/^[0-9a-f]{40}$/);
    expect(sentMail()).toHaveLength(1);
    expect(sentMail()[0].to).toBe("ada@example.com");
    expect(sentMail()[0].text).toContain(`/reset-password/${token}`);
  });

  test("validate-reset-token: valid and invalid", async () => {
    const ok = await json(usersValidate.GET(jsonRequest(`/api/users/validate-reset-token?token=${token}`)));
    expect(ok.body.success).toBe(true);
    expect(ok.body.user.email).toBe("ada@example.com");
    expect(ok.body.user.password).toBeUndefined();

    const bad = await json(usersValidate.GET(jsonRequest("/api/users/validate-reset-token?token=bogus")));
    expect(bad.body.success).toBe(false);
  });

  test("reset-password: sets the new password and clears the token", async () => {
    const { body } = await json(usersReset.POST(jsonRequest("/api/users/reset-password", { token, password: "reset-pw" })));
    expect(body).toEqual({ success: true, message: "Password has been reset" });
    expect(await authorize({ email: "ada@example.com", password: "reset-pw" }, {})).toBeTruthy();

    const reuse = await json(usersReset.POST(jsonRequest("/api/users/reset-password", { token, password: "again" })));
    expect(reuse.body.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
describe("users: subscribe + contact", () => {
  test("subscribe-email accepts the old un-typed body and rejects duplicates", async () => {
    // The v1 footer posted JSON without a Content-Type header.
    const first = await json(usersSubscribe.POST(jsonRequest("/api/users/subscribe-email", JSON.stringify({ email: "news@example.com" }), { contentType: null })));
    expect(first.body).toMatchObject({ email: "news@example.com" });
    const dup = await json(usersSubscribe.POST(jsonRequest("/api/users/subscribe-email", { email: "news@example.com" })));
    expect(dup.body).toBeNull();
  });

  test("contact saves the message and emails both admins", async () => {
    clearMail();
    const { body } = await json(
      usersContact.POST(jsonRequest("/api/users/contact", { name: "Bea", email: "bea@example.com", subject: "Hello", message: "Hi there" }))
    );
    expect(body).toEqual({ message: "Successfully Sent" });
    expect(sentMail().map((m) => m.to).sort()).toEqual(["admin@passionofhope.org", "uchenna@passionofhope.org"]);
    expect(sentMail()[0].subject).toBe("Hello From Chakulabora Network");
    const { Contact } = await dbCon();
    expect(await Contact.countDocuments({ email: "bea@example.com" })).toBe(1);
  });
});

// ---------------------------------------------------------------------------
describe("posts", () => {
  let author: { id: string; email: string; fname?: string; lname?: string };
  let voter: string;
  let postId: string;
  const blob = "how-do-i-improve-clay-soil";

  beforeAll(async () => {
    const { User } = await dbCon();
    const ada = await User.findOne({ email: "ada@example.com" });
    author = { id: String(ada!._id), email: "ada@example.com", fname: "Ada", lname: "Lovelace" };
    voter = String((await User.findOne({ email: "minimal@example.com" }))!._id);
  });

  const createPost = (title: string, extra: Record<string, unknown> = {}) =>
    json(postsCreate.POST(jsonRequest("/api/posts/create", { title, body: "<p>My soil is <b>heavy</b> clay.</p>", category: "Soil Science", image: "", author, ...extra })));

  test("create: slug from title, auto-approved, admin emailed", async () => {
    clearMail();
    const { body } = await createPost("How do I improve clay soil?");
    expect(body.message).toBe("Post created successfully");
    expect(body.post).toMatchObject({ blob, approved: true, category: "Soil Science", upvotes: [], downvotes: [] });
    expect(body.post.time).toBeString();
    postId = body.post._id;
    expect(sentMail()).toHaveLength(1);
    expect(sentMail()[0].text).toContain("Ada Lovelace");
  });

  test("create: duplicate title gets a unique blob (Mongoose 9 pre-save hook)", async () => {
    const { body } = await createPost("How do I improve clay soil?");
    expect(body.post.blob).toMatch(new RegExp(`^${blob}-\\d+$`));
    const { Post } = await dbCon();
    expect(await Post.countDocuments({ blob })).toBe(1);
  });

  test("create: author without a name still works (names optional)", async () => {
    clearMail();
    const { body } = await createPost("Nameless question", { author: { id: voter, email: "minimal@example.com" } });
    expect(body.post).not.toBeNull();
    expect(sentMail()[0].text).toContain("minimal@example.com");
  });

  test("create: validation error is reported, post is null", async () => {
    const { body } = await json(postsCreate.POST(jsonRequest("/api/posts/create", { title: "No body", author })));
    expect(body.post).toBeNull();
    expect(body.message).toMatch(/body/i);
  });

  test("find: approved posts, without body, newest first", async () => {
    const { body } = await json(postsFind.POST());
    expect(body.length).toBeGreaterThanOrEqual(3);
    expect(body[0].title).toBe("Nameless question");
    expect(body.every((p: { body?: string }) => p.body === undefined)).toBe(true);
  });

  test("[post]: fetch by blob; unknown blob is null", async () => {
    const found = await json(postsOne.POST(jsonRequest(`/api/posts/${blob}`, {}), ctx({ post: blob })));
    expect(found.body).toMatchObject({ _id: postId, title: "How do I improve clay soil?" });
    const missing = await json(postsOne.POST(jsonRequest("/api/posts/nope", {}), ctx({ post: "nope" })));
    expect(missing.body).toBeNull();
  });

  test("like → unlike updates votes and the author's points", async () => {
    const { User, Post } = await dbCon();
    const pv = async () => (await User.findById(author.id))!.pv as number;
    const before = await pv();

    const liked = await json(postsLike.POST(jsonRequest("/api/posts/like", { like: true, post_id: postId, author_id: author.id, user_id: voter })));
    expect(liked.body).toBe(true);
    await Bun.sleep(50); // saves are fire-and-forget in the original logic
    expect((await Post.findById(postId))!.upvotes).toEqual([voter]);
    expect(await pv()).toBe(before + 1);

    // A second like must not duplicate the vote.
    await postsLike.POST(jsonRequest("/api/posts/like", { like: true, post_id: postId, author_id: author.id, user_id: voter }));
    await Bun.sleep(50);
    expect((await Post.findById(postId))!.upvotes).toEqual([voter]);

    const removed = await json(postsDislike.POST(jsonRequest("/api/posts/dislike", { like: true, post_id: postId, author_id: author.id, user_id: voter })));
    expect(removed.body).toBe(true);
    await Bun.sleep(50);
    expect((await Post.findById(postId))!.upvotes).toEqual([]);
  });

  test("dislike → remove dislike", async () => {
    const { Post } = await dbCon();
    await postsLike.POST(jsonRequest("/api/posts/like", { like: false, post_id: postId, author_id: author.id, user_id: voter }));
    await Bun.sleep(50);
    expect((await Post.findById(postId))!.downvotes).toEqual([voter]);
    await postsDislike.POST(jsonRequest("/api/posts/dislike", { like: false, post_id: postId, author_id: author.id, user_id: voter }));
    await Bun.sleep(50);
    expect((await Post.findById(postId))!.downvotes).toEqual([]);
  });

  test("create: malicious HTML in the body is sanitized before saving", async () => {
    const { body } = await createPost("XSS attempt", {
      body: '<p>ok</p><script>alert(1)</script><img src=x onerror="alert(1)"><a href="javascript:alert(1)">x</a>',
    });
    const { Post } = await dbCon();
    const stored = (await Post.findById(body.post._id))!.body as string;
    expect(stored).toBe("<p>ok</p><a target=\"_blank\" rel=\"noopener noreferrer nofollow ugc\">x</a>");
  });

  test("read path sanitizes content stored before sanitization existed", async () => {
    const { Post } = await dbCon();
    await Post.collection.insertOne({
      title: "Legacy",
      blob: "legacy-unsafe",
      body: '<p>legacy</p><iframe src="https://evil.example"></iframe>',
      author: { id: author.id },
      approved: true,
    });
    const viaApi = await json(postsOne.POST(jsonRequest("/api/posts/legacy-unsafe", {}), ctx({ post: "legacy-unsafe" })));
    expect(viaApi.body.body).toBe("<p>legacy</p>");
    await Post.deleteOne({ blob: "legacy-unsafe" });
  });

  test("like on an unknown post returns false", async () => {
    const { body } = await json(postsLike.POST(jsonRequest("/api/posts/like", { like: true, post_id: "000000000000000000000000", author_id: author.id, user_id: voter })));
    expect(body).toBe(false);
  });

  test("moderation: unapproved list → approve → reject", async () => {
    const { Post } = await dbCon();
    const { body } = await createPost("Pending question");
    await Post.updateOne({ _id: body.post._id }, { approved: false });

    const pending = await json(postsUnapproved.POST());
    expect(pending.body.map((p: { title: string }) => p.title)).toContain("Pending question");
    expect(pending.body[0].body).toBeUndefined();

    const approved = await json(postsApprove.POST(jsonRequest("/api/posts/approve", { _id: body.post._id })));
    expect(approved.body.approved).toBe(true);

    const rejected = await json(postsReject.POST(jsonRequest("/api/posts/reject", { blob: body.post.blob })));
    expect(rejected.body).toMatchObject({ acknowledged: true, deletedCount: 1 });
  });

  test("lib/posts helpers used by the server-rendered pages", async () => {
    expect(await getPostByBlob(blob)).toMatchObject({ title: "How do I improve clay soil?" });
    expect(await getPostByBlob("missing")).toBeNull();
    expect((await getApprovedPosts()).length).toBeGreaterThan(0);
    expect(plainText("<p>My soil is <b>heavy</b>&nbsp;clay.</p>")).toBe("My soil is heavy clay.");
    expect(plainText("x".repeat(300)).length).toBe(160);
  });

  // ---------------------------------------------------------------------------
  describe("answers", () => {
    let answerA: string;
    let answerB: string;

    test("empty editor content is rejected", async () => {
      const { body } = await json(answersCreate.POST(jsonRequest("/api/answers/create", { body: "<p><br></p>", author, post: postId, blob })));
      expect(body).toEqual({ answer: null, message: "The post cannot be empty" });
    });

    test("an answer that is only a script counts as empty after sanitizing", async () => {
      const { body } = await json(answersCreate.POST(jsonRequest("/api/answers/create", { body: "<script>alert(1)</script>", author, post: postId, blob })));
      expect(body).toEqual({ answer: null, message: "The post cannot be empty" });
    });

    test("create answers (named and anonymous); admins notified", async () => {
      clearMail();
      const a = await json(answersCreate.POST(jsonRequest("/api/answers/create", { body: "<p>Add compost.</p>", author, post: postId, blob })));
      expect(a.body.message).toBe("Post success");
      answerA = a.body.answer._id;
      const b = await json(answersCreate.POST(jsonRequest("/api/answers/create", { body: "<p>Use gypsum.</p>", author: null, post: postId, blob })));
      answerB = b.body.answer._id;
      await Bun.sleep(20);
      expect(sentMail().filter((m) => m.subject === "New answer")).toHaveLength(6); // 3 admins × 2 answers
    });

    test("answer votes + listing sorted by upvotes", async () => {
      const liked = await json(answersLike.POST(jsonRequest("/api/answers/like", { like: true, answer_id: answerB, author_id: author.id, user_id: voter })));
      expect(liked.body).toBe(true);
      await Bun.sleep(50);
      const list = await json(answersById.POST(jsonRequest(`/api/answers/${postId}`, {}), ctx({ id: postId })));
      expect(list.body.map((a: { _id: string }) => a._id)).toEqual([answerB, answerA]);
      expect(await getAnswersForPost(postId)).toHaveLength(2);

      const unliked = await json(answersDislike.POST(jsonRequest("/api/answers/dislike", { like: true, answer_id: answerB, author_id: author.id, user_id: voter })));
      expect(unliked.body).toBe(true);
    });

    test("count: questions and answers per user", async () => {
      const { body } = await json(userCount.GET(jsonRequest(`/api/${author.id}/count`), ctx({ user: author.id })));
      expect(body).toEqual({ posts: 3, answers: 1 });
    });

    test("GET /api/answers/[id] deletes the answer", async () => {
      const { body } = await json(answersById.GET(jsonRequest(`/api/answers/${answerA}`), ctx({ id: answerA })));
      expect(body).toEqual({ success: true, message: "Answer deleted" });
      expect(await getAnswersForPost(postId)).toHaveLength(1);
    });
  });
});

// ---------------------------------------------------------------------------
describe("users: delete", () => {
  test("POST /api/[user]/delete removes the account", async () => {
    const { User } = await dbCon();
    const u = await User.create({ email: "bye@example.com", password: "x" });
    const { body } = await json(userDelete.POST(jsonRequest(`/api/${u._id}/delete`, {}), ctx({ user: String(u._id) })));
    expect(body).toMatchObject({ acknowledged: true, deletedCount: 1 });
  });
});

describe("helpers", () => {
  test("displayName falls back when names are missing", () => {
    expect(displayName({ fname: "Ada", lname: "Lovelace" })).toBe("Ada Lovelace");
    expect(displayName({ fname: "Ada" })).toBe("Ada");
    expect(displayName({}, "ada@example.com")).toBe("ada@example.com");
    expect(displayName(null)).toBe("Anonymous");
  });
});
