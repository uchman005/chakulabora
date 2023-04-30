import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import parse from "html-react-parser";
import { IPost, IAnswer } from "../../../interface";
import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";
import Router from "next/router";
import {
  AiFillDislike,
  AiFillLike,
  AiOutlineDislike,
  AiOutlineLike,
} from "react-icons/ai";
import dynamic from "next/dynamic";
import { useState } from "react";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});
const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  "font",
  "header",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
];
const placeholder = "Please be as detailed as possible.";
const scrollingContainer = "auto-grow";

const postFetcher = async (url: string) => {
  const res = await axios.post(url);
  const data: IPost | null = res.data;
  return data;
};
const answerFetcher = async (url: string) => {
  const res = await axios.post(url);
  const data: Array<IAnswer> | null = res.data;
  return data;
};
const Answer = ({ data }: any) => {
  const toast = useToast();
  const { status } = useSession();

  return (
    <div className="flex border-b-1 items-center justify-start my-5">
      {status === "authenticated" ? (
        <div className="flex flex-col">
          <button
            onClick={() => {
              const body = parse(data.body);
              toast({
                title: "Answer Liked",
                description: body,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
                size: { width: "300", height: "200" },
                variant: "top-accent",
              });
            }}
          >
            <AiOutlineLike />
          </button>
          {data.upvotes?.length - data.downvotes.length}
          <button
            onClick={() => {
              const body = parse(data.body);
              toast({
                title: "Answer Disliked",
                description: body,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
                size: { width: "300", height: "200" },
                variant: "top-accent",
              });
            }}
          >
            <AiOutlineDislike />
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          <button
            onClick={() => {
              toast({
                title: "You are logged out",
                description: "You must be signed in to like",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
                size: { width: "300", height: "200" },
                variant: "top-accent",
              });
            }}
          >
            <AiOutlineLike />
          </button>
          {data.upvotes?.length + data.downvotes.length}
          <button
            onClick={() => {
              toast({
                title: "You are logged out",
                description: "You must be signed in to dislike",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
                size: { width: "300", height: "200" },
                variant: "top-accent",
              });
            }}
          >
            <AiOutlineDislike />
          </button>
        </div>
      )}
      <div className="">
        <div>{parse(data.body)}</div>
        <div className="flex gap-5">
          <div>{`${data.author.fname} ${data.author.lname}`}</div>
          <div>{data.time}</div>
        </div>
      </div>
    </div>
  );
};
const Answers = ({ data }: any) => {
  const { data: answers } = useSWR(`/api/answers/${data?._id}`, answerFetcher);
  if (answers === null) return <h1>Answers not found</h1>;
  if (answers === undefined) return <h1>Answers is not defined</h1>;
  if (answers.length == 0) return <h1>No answers Yet</h1>;
  return (
    <div>
      <p>
        {answers.length} answer{answers.length == 1 ? "" : "s"} for this post
      </p>
      <div>
        {answers.map((item, index) => (
          <Answer key={index} data={item} />
        ))}
      </div>
    </div>
  );
};
const Post = () => {
  const handleReject = () => {
    toast({
      title: "Post rejected",
      description:
        "You have rejected this post, A mail will be sent to the user",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
      size: { width: "300", height: "200" },
      variant: "top-accent",
    });
  };
  const handleAccept = async () => {
    const response = await axios.post("/api/posts/approve", { _id: data?._id });
    const res = response.data;
    if (res.approved === true) {
      toast({
        title: "Approved successfully",
        description: "Post has been approved successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
        size: { width: "300", height: "200" },
        variant: "top-accent",
      });
      Router.replace("/dashboard/approve", "/dashboard/approve");
      return;
    }
    toast({
      title: "Approval Failed",
      description: `Post approval failed for some reason ${response.statusText}`,
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top",
      size: { width: "300", height: "200" },
      variant: "top-accent",
    });
  };
  const [value, setValue] = useState("");
  const toast = useToast();
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  const { post } = router.query;
  const { data, isLoading, mutate } = useSWR(`/api/posts/${post}`, postFetcher);
  const { status } = useSession();
  const [stateData, setData] = useState(false);
  if (isLoading || status === "loading") return <h1>Loading...</h1>;
  if (data === null) return <h1>Post not found</h1>;
  if (data === undefined) return <h1>Post is not defined</h1>;
  const like_post = async () => {
    const api = data.upvotes?.includes(user.id) ? "/api/posts/dislike": "/api/posts/like";
    const title = data.upvotes?.includes(user.id) ? "Like Removed": "Post Liked";
    const desc = data.upvotes?.includes(user.id) ? "Your like for this post was removed, thanks for your feedback": "You liked the post, thanks for your feedback";
    const response = await axios.post(api, {
      like: true,
      post_id: data._id,
      author_id: data.author.id,
      user_id: user.id,
    });
    const liked = response.data;
    if (liked) {
      mutate();
      toast({
        title: title,
        description:desc,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
        size: { width: "300", height: "200" },
        variant: "top-accent",
      });
    }
    return;
  }
  const dislike_post = async () => {
    const api = data.downvotes?.includes(user.id) ? "/api/posts/dislike": "/api/posts/like";
    const title = data.downvotes?.includes(user.id) ? "Dislike Removed": "Post Disliked";
    const desc = data.downvotes?.includes(user.id) ? "Your dislike for this post was removed, thanks for your feedback": "You disliked the post, thanks for your feedback";
    const response = await axios.post(api, {
      like: false,
      post_id: data._id,
      author_id: data.author.id,
      user_id: user.id,
    });
    const liked = response.data;
    if (liked) {
      mutate();
      toast({
        title: title,
        description:desc,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
        size: { width: "300", height: "200" },
        variant: "top-accent",
      });
    }
    return;
  }
  return (
    <div className="px-3 text-gray-700">
      {status === "authenticated" &&
      data.approved === false &&
      (user.role !== "" || user.role !== "Community Member") ? (
        <div>
          <h2 className="mb-4">Read the post below and approve</h2>
          <p>The question must pass these criteria</p>
          <ol>
            <li>Must be in English</li>
            <li>Information on the body must match the title</li>
            <li>Must not contain adverts of any kind</li>
          </ol>

          <div>
            <p>Title: {data.title}</p>
            <p>Category: {data.category}</p>
            <p>Body: </p>
            <div className="text-center">{parse(data.body)}</div>
          </div>

          <div className="flex justify-between m-3 p-4">
            <button
              className="btn btn-success btn-block text-white text-2xl"
              onClick={handleAccept}
            >
              Approve
            </button>
            <button
              className="btn btn-danger btn-block text-white text-2xl"
              onClick={handleReject}
            >
              Reject
            </button>
          </div>
        </div>
      ) : data.approved === false ? (
        <div className="text-center text-3xl underline">
          This post is not yet approved
        </div>
      ) : (
        <div>
          <div className="text-center">
            <h1 className="mb-4">{data.title}</h1>
            <div>{parse(data.body)}</div>
          </div>
          <div className="flex gap-5 justify-between px-3">
            <div>
              <p>Asked by</p>{" "}
              <span className="text-xl">{`${data.author.fname} ${data.author.lname}`}</span>
            </div>
            <div>
              <p>Date</p> <span className="text-wrap">{data.time}</span>
            </div>
            <div>
              <p>Category</p>
              <span className="text-wrap">{data.category}</span>
            </div>
          </div>
          {status === "authenticated" ? (
            <div className="flex gap-5 justify-evenly m-4 px-3">
              {!data.downvotes?.includes(user.id) && (
                <button
                  onClick={like_post}
                  className="flex items-center"
                >
                  {!data.upvotes?.includes(user.id) ? (
                    <AiOutlineLike className="hover:bg-gray-300 text-2xl" />
                  ) : (
                    <AiFillLike className="text-red-600 hover:bg-gray-300 text-2xl" />
                  )}{" "}
                  {data?.upvotes?.length}
                </button>
              )}
              {!data.upvotes?.includes(user.id) && (
                <button
                  onClick={dislike_post}
                  className="flex items-center "
                >
                  {!data.downvotes?.includes(user.id) ? (
                    <AiOutlineDislike className="hover:bg-gray-300 text-2xl" />
                  ) : (
                    <AiFillDislike className="hover:bg-gray-300 text-2xl" />
                  )}{" "}
                  {data?.downvotes?.length}
                </button>
              )}
            </div>
          ) : (
            <div className="flex gap-5 justify-evenly m-4 px-3">
              <div
                onClick={() => {
                  toast({
                    title: "You're signed out",
                    description: "You must be signed in to perform this action",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                    size: { width: "300", height: "200" },
                    variant: "top-accent",
                  });
                }}
              >
                Likes :{data?.upvotes?.length}
              </div>
              <div
                onClick={() => {
                  toast({
                    title: "You're signed out",
                    description: "You must be signed in to perform this action",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                    size: { width: "300", height: "200" },
                    variant: "top-accent",
                  });
                }}
              >
                Dislikes: {data?.downvotes?.length}
              </div>
            </div>
          )}

          <div className="p-1 m-2 ">
            <Answers data={data} key={stateData.toString()} />
          </div>
          {status === "authenticated" ? (
            <div>
              <h5>Post your answer</h5>
              <QuillNoSSRWrapper
                modules={modules}
                value={value}
                onChange={setValue}
                placeholder={placeholder}
                formats={formats}
                theme="snow"
                scrollingContainer={scrollingContainer}
                className="mb-3"
              />
              <button
                className="btn rounded btn-outline-success"
                onClick={async () => {
                  const response = await axios.post("/api/answers/create", {
                    body: value,
                    author: user,
                    post: data._id,
                  });
                  const { answer, message } = response.data;
                  if (answer !== null) {
                    toast({
                      title: "Answer posted",
                      description: message,
                      status: "success",
                      duration: 5000,
                      isClosable: true,
                      position: "top",
                      size: { width: "300", height: "200" },
                      variant: "top-accent",
                    });
                    setValue("");
                    setData(!stateData); // This is purely to trigger a rerender in the Answers component
                    return;
                  } else {
                    toast({
                      title: "Answer posting failed",
                      description: message,
                      status: "warning",
                      duration: 5000,
                      isClosable: true,
                      position: "top",
                      size: { width: "300", height: "200" },
                      variant: "top-accent",
                    });
                  }
                }}
              >
                Post
              </button>
            </div>
          ) : (
            <div>Login to post an answer</div>
          )}
        </div>
      )}
    </div>
  );
};

const Index = () => {
  return (
    <Sidebar>
      <Post />
    </Sidebar>
  );
};
export default Index;
