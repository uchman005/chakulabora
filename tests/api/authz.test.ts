/**
 * Access-control suite: what each kind of caller may and may not do, written as attacks.
 * Only the session lookup is stubbed (signInAs); every permission check runs for real.
 * Real signed cookies are covered in tests/e2e.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, test } from "bun:test";
import bcrypt from "bcrypt";
import { ctx, json, jsonRequest, signInAs } from "../helpers";
import { dbCon } from "@/models";

import * as userCount from "@/app/api/[user]/count/route";
import * as userDelete from "@/app/api/[user]/delete/route";
import * as userUpdate from "@/app/api/[user]/update/route";
import * as userGet from "@/app/api/[user]/user/route";
import * as answersById from "@/app/api/answers/[id]/route";
import * as answersCreate from "@/app/api/answers/create/route";
import * as answersDislike from "@/app/api/answers/dislike/route";
import * as answersLike from "@/app/api/answers/like/route";
import * as postsOne from "@/app/api/posts/[post]/route";
import * as postsApprove from "@/app/api/posts/approve/route";
import * as postsCreate from "@/app/api/posts/create/route";
import * as postsDislike from "@/app/api/posts/dislike/route";
import * as postsFind from "@/app/api/posts/find/route";
import * as postsImagekit from "@/app/api/posts/imagekit/route";
import * as postsLike from "@/app/api/posts/like/route";
import * as postsReject from "@/app/api/posts/reject/route";
import * as postsUnapproved from "@/app/api/posts/unapproved/route";
import * as usersForgot from "@/app/api/users/forgotpassword/route";
import * as usersReset from "@/app/api/users/reset-password/route";
import * as usersUpdatePassword from "@/app/api/users/updatepassword/route";

let victim: string;
let attacker: string;
let moderator: string;
let approvedPost: string;
let pendingPost: string;
let pendingBlob: string;
let answer: string;

beforeAll(async () => {
  const { User, Post, Answer } = await dbCon();
  await User.init();
  const password = await bcrypt.hash("victim-pw", 4);
  const v = await User.create({ email: "victim@authz.test", password, fname: "Vic", phone: "+254700000001", pv: 0 });
  const a = await User.create({ email: "attacker@authz.test", password, fname: "Att" });
  const m = await User.create({ email: "mod@authz.test", password, fname: "Mo", role: "Moderator" });
  victim = String(v._id);
  attacker = String(a._id);
  moderator = String(m._id);

  const author = { id: victim, fname: "Vic", email: "victim@authz.test" };
  const approved = await Post.create({ title: "Authz approved", body: "<p>open</p>", author, blob: "authz-approved", approved: true, upvotes: [], downvotes: [] });
  const pending = await Post.create({ title: "Authz pending", body: "<p>secret draft</p>", image: "https://ik.imagekit.io/x/y.png", author, blob: "authz-pending", approved: false });
  approvedPost = String(approved._id);
  pendingPost = String(pending._id);
  pendingBlob = pending.blob;
  const ans = await Answer.create({ body: "<p>an answer</p>", author, post: approvedPost, upvotes: [], downvotes: [] });
  answer = String(ans._id);
});

beforeEach(() => signInAs(null));
afterAll(() => signInAs(null));

const profileBody = { fname: "Hacked" };

describe("signed-out callers are refused (401)", () => {
  const protectedCalls: [string, () => Promise<Response>][] = [
    ["read a profile", () => userGet.GET(jsonRequest(`/api/${victim}/user`), ctx({ user: victim }))],
    ["read counts", () => userCount.GET(jsonRequest(`/api/${victim}/count`), ctx({ user: victim }))],
    ["update a profile", () => userUpdate.POST(jsonRequest(`/api/${victim}/update`, profileBody), ctx({ user: victim }))],
    ["delete an account", () => userDelete.POST(jsonRequest(`/api/${victim}/delete`, {}), ctx({ user: victim }))],
    ["change a password", () => usersUpdatePassword.POST(jsonRequest("/api/users/updatepassword", { id: victim, password: "x" }))],
    ["create a post", () => postsCreate.POST(jsonRequest("/api/posts/create", { title: "t", body: "<p>b</p>", author: { id: victim } }))],
    ["like a post", () => postsLike.POST(jsonRequest("/api/posts/like", { like: true, post_id: approvedPost, user_id: victim }))],
    ["unlike a post", () => postsDislike.POST(jsonRequest("/api/posts/dislike", { like: true, post_id: approvedPost, user_id: victim }))],
    ["like an answer", () => answersLike.POST(jsonRequest("/api/answers/like", { like: true, answer_id: answer, user_id: victim }))],
    ["unlike an answer", () => answersDislike.POST(jsonRequest("/api/answers/dislike", { like: true, answer_id: answer, user_id: victim }))],
    ["get upload credentials", () => postsImagekit.GET()],
    ["list pending posts", () => postsUnapproved.POST()],
    ["approve a post", () => postsApprove.POST(jsonRequest("/api/posts/approve", { _id: pendingPost }))],
    ["reject a post", () => postsReject.POST(jsonRequest("/api/posts/reject", { blob: pendingBlob }))],
    ["delete an answer", () => answersById.DELETE(jsonRequest(`/api/answers/${answer}`, undefined, { method: "DELETE" }), ctx({ id: answer }))],
  ];
  for (const [name, call] of protectedCalls) {
    test(`cannot ${name}`, async () => {
      expect((await call()).status).toBe(401);
    });
  }
});

describe("another member's account is off limits (403)", () => {
  beforeEach(() => signInAs(attacker));

  test("cannot read, count, update or delete it", async () => {
    expect((await userGet.GET(jsonRequest(`/api/${victim}/user`), ctx({ user: victim }))).status).toBe(403);
    expect((await userCount.GET(jsonRequest(`/api/${victim}/count`), ctx({ user: victim }))).status).toBe(403);
    expect((await userUpdate.POST(jsonRequest(`/api/${victim}/update`, profileBody), ctx({ user: victim }))).status).toBe(403);
    expect((await userDelete.POST(jsonRequest(`/api/${victim}/delete`, {}), ctx({ user: victim }))).status).toBe(403);
    const { User } = await dbCon();
    expect((await User.findById(victim))!.fname).toBe("Vic");
  });

  test("changing a password with someone else's id only changes your own", async () => {
    const { User } = await dbCon();
    const before = (await User.findById(victim))!.password;
    const { body } = await json(usersUpdatePassword.POST(jsonRequest("/api/users/updatepassword", { id: victim, password: "stolen" })));
    expect(body).toBe(true);
    expect((await User.findById(victim))!.password).toBe(before);
    expect(await bcrypt.compare("stolen", (await User.findById(attacker))!.password as string)).toBe(true);
  });

  test("the old nested { data: { id } } shape can't target anyone either", async () => {
    const { User } = await dbCon();
    const before = (await User.findById(victim))!.password;
    await usersUpdatePassword.POST(jsonRequest("/api/users/updatepassword", { data: { id: victim, password: "stolen2" } }));
    expect((await User.findById(victim))!.password).toBe(before);
  });
});

describe("moderator actions need a moderator", () => {
  test("ordinary members get 403", async () => {
    signInAs(attacker);
    expect((await postsUnapproved.POST()).status).toBe(403);
    expect((await postsApprove.POST(jsonRequest("/api/posts/approve", { _id: pendingPost }))).status).toBe(403);
    expect((await postsReject.POST(jsonRequest("/api/posts/reject", { blob: pendingBlob }))).status).toBe(403);
    expect((await answersById.DELETE(jsonRequest(`/api/answers/${answer}`, undefined, { method: "DELETE" }), ctx({ id: answer }))).status).toBe(403);
    const { Post, Answer } = await dbCon();
    expect((await Post.findById(pendingPost))!.approved).toBe(false);
    expect(await Answer.findById(answer)).not.toBeNull();
  });

  test("a role sent by the client is ignored", async () => {
    signInAs(attacker);
    const res = await postsApprove.POST(jsonRequest("/api/posts/approve", { _id: pendingPost, role: "Moderator", user: { role: "Moderator" } }));
    expect(res.status).toBe(403);
  });

  test("a member cannot promote themselves through a profile update", async () => {
    signInAs(attacker);
    await userUpdate.POST(jsonRequest(`/api/${attacker}/update`, { fname: "Att", role: "Moderator", pv: 9999, email: "mod@authz.test" }), ctx({ user: attacker }));
    const { User } = await dbCon();
    const me = await User.findById(attacker);
    expect(me!.role).toBe("Community Member");
    expect(me!.pv).toBe(0);
    expect(me!.email).toBe("attacker@authz.test");
  });

  test("moderators can list and read pending posts and other profiles", async () => {
    signInAs(moderator);
    const list = await json(postsUnapproved.POST());
    expect(list.status).toBe(200);
    expect(list.body.map((p: { title: string }) => p.title)).toContain("Authz pending");
    const profile = await json(userGet.GET(jsonRequest(`/api/${victim}/user`), ctx({ user: victim })));
    expect(profile.body.email).toBe("victim@authz.test");
    const full = await json(postsOne.POST(jsonRequest(`/api/posts/${pendingBlob}`, {}), ctx({ post: pendingBlob })));
    expect(full.body.body).toContain("secret draft");
  });

  test("a demoted moderator loses access immediately", async () => {
    const { User } = await dbCon();
    await User.updateOne({ _id: moderator }, { role: "Community Member" });
    signInAs(moderator);
    expect((await postsUnapproved.POST()).status).toBe(403);
    await User.updateOne({ _id: moderator }, { role: "Moderator" });
  });

  test("a session for a deleted account counts as signed out", async () => {
    signInAs("000000000000000000000000");
    expect((await postsUnapproved.POST()).status).toBe(401);
  });
});

describe("identity comes from the session, not the request", () => {
  test("a post can't be published under someone else's name", async () => {
    signInAs(attacker);
    const { body } = await json(postsCreate.POST(jsonRequest("/api/posts/create", { title: "Forged post", body: "<p>x</p>", author: { id: victim, fname: "Vic" } })));
    expect(body.post.author.id).toBe(attacker);
    expect(body.post.author.fname).toBe("Att");
    expect(body.post.author.email).toBeUndefined();
  });

  test("an answer can't be published under someone else's name", async () => {
    signInAs(attacker);
    const { body } = await json(answersCreate.POST(jsonRequest("/api/answers/create", { body: "<p>forged</p>", author: { id: victim, fname: "Vic" }, post: approvedPost, blob: "x" })));
    expect(body.answer.author).toEqual({ id: attacker, fname: "Att" });
  });

  test("signed-out answers are anonymous, even if the request claims an author", async () => {
    const { body } = await json(answersCreate.POST(jsonRequest("/api/answers/create", { body: "<p>anon</p>", author: { id: victim, fname: "Vic" }, post: approvedPost, blob: "x" })));
    expect(body.answer.author).toBeNull();
  });

  test("votes count for the signed-in user, not a user_id in the request", async () => {
    signInAs(attacker);
    await postsLike.POST(jsonRequest("/api/posts/like", { like: true, post_id: approvedPost, user_id: victim, author_id: attacker }));
    const { Post, User } = await dbCon();
    expect((await Post.findById(approvedPost))!.upvotes).toEqual([attacker]);
    // Points go to the post's real author, not an author_id in the request.
    expect((await User.findById(victim))!.pv).toBe(1);
    expect((await User.findById(attacker))!.pv).toBe(0);
  });

  test("repeat votes can't farm points", async () => {
    signInAs(attacker);
    for (let i = 0; i < 3; i++) await postsLike.POST(jsonRequest("/api/posts/like", { like: true, post_id: approvedPost }));
    const { User } = await dbCon();
    expect((await User.findById(victim))!.pv).toBe(1);
    // Removing a vote that doesn't exist changes nothing either.
    await postsDislike.POST(jsonRequest("/api/posts/dislike", { like: false, post_id: approvedPost }));
    expect((await User.findById(victim))!.pv).toBe(1);
  });

  test("voting on an anonymous answer works and awards no one", async () => {
    signInAs(attacker);
    const { Answer } = await dbCon();
    const anon = await Answer.create({ body: "<p>a</p>", author: null, post: approvedPost, upvotes: [], downvotes: [] });
    const { body } = await json(answersLike.POST(jsonRequest("/api/answers/like", { like: true, answer_id: String(anon._id) })));
    expect(body).toBe(true);
  });
});

describe("public data doesn't leak", () => {
  test("pending post content is hidden from anonymous callers and members", async () => {
    for (const who of [null, () => attacker]) {
      signInAs(who ? who() : null);
      const { body } = await json(postsOne.POST(jsonRequest(`/api/posts/${pendingBlob}`, {}), ctx({ post: pendingBlob })));
      expect(body.approved).toBe(false);
      expect(body.body).toBe("");
      expect(body.image).toBe("");
    }
  });

  test("author email is not exposed by public post and answer reads", async () => {
    const one = await json(postsOne.POST(jsonRequest("/api/posts/authz-approved", {}), ctx({ post: "authz-approved" })));
    expect(one.body.author.email).toBeUndefined();
    const list = await json(postsFind.POST());
    expect(JSON.stringify(list.body)).not.toContain("victim@authz.test");
    const answers = await json(answersById.POST(jsonRequest(`/api/answers/${approvedPost}`, {}), ctx({ id: approvedPost })));
    expect(JSON.stringify(answers.body)).not.toContain("victim@authz.test");
  });

  test("a plain GET can no longer delete an answer", () => {
    expect((answersById as Record<string, unknown>).GET).toBeUndefined();
  });
});

describe("query-injection on public password routes", () => {
  test("reset-password rejects a query object as the token", async () => {
    const { User } = await dbCon();
    await User.updateOne({ _id: victim }, { resetPasswordToken: "real-token", resetPasswordExpires: new Date(Date.now() + 1e6) });
    const before = (await User.findById(victim))!.password;
    const { body } = await json(usersReset.POST(jsonRequest("/api/users/reset-password", { token: { $ne: null }, password: "pwned" })));
    expect(body.success).toBe(false);
    expect((await User.findById(victim))!.password).toBe(before);
    await User.updateOne({ _id: victim }, { $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 } });
  });

  test("forgotpassword rejects a query object as the email", async () => {
    const { body } = await json(usersForgot.POST(jsonRequest("/api/users/forgotpassword", { email: { $ne: null } })));
    expect(body).toEqual({ success: false, message: "User not found" });
  });
});

describe("what signed-in members can still do", () => {
  test("read and update their own profile, and vote", async () => {
    signInAs(victim);
    const profile = await json(userGet.GET(jsonRequest(`/api/${victim}/user`), ctx({ user: victim })));
    expect(profile.status).toBe(200);
    expect(profile.body.phone).toBe("+254700000001");
    const updated = await json(userUpdate.POST(jsonRequest(`/api/${victim}/update`, { fname: "Victoria" }), ctx({ user: victim })));
    expect(updated.body.fname).toBe("Victoria");
    const counts = await json(userCount.GET(jsonRequest(`/api/${victim}/count`), ctx({ user: victim })));
    expect(counts.status).toBe(200);
    const vote = await json(answersLike.POST(jsonRequest("/api/answers/like", { like: true, answer_id: answer })));
    expect(vote.body).toBe(true);
  });

  test("moderators can delete answers with DELETE", async () => {
    signInAs(moderator);
    const { body } = await json(answersById.DELETE(jsonRequest(`/api/answers/${answer}`, undefined, { method: "DELETE" }), ctx({ id: answer })));
    expect(body).toEqual({ success: true, message: "Answer deleted" });
  });
});
