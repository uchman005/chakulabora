import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from 'axios';
import parse from 'html-react-parser'
import { IPost } from '../../../interface';
import Sidebar from '@/components/Sidebar';
import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import Router from 'next/router';
import {AiFillDislike, AiFillLike,AiOutlineDislike,AiOutlineLike} from 'react-icons/ai'
const fetcher = async (url: string) => {
  const res = await axios.post(url);
  const data: IPost | null = res.data;
  return data;
}

const Post = () => {
  const handleReject = () => {
    toast({
      title: 'Post creation Failed',
      description: "message",
      status: 'warning',
      duration: 5000,
      isClosable: true,
      position: "top",
      size: { width: '300', height: '200' },
      variant: 'top-accent'
    })
  }
  const handleAccept = async () => {
    const response = await axios.post('/api/posts/approve', { _id: data?._id });
    const res = response.data;
    console.log(response)
    if (res.approved === true) {
      toast({
        title: 'Approved successfully',
        description: "Post has been approved successfully",
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: "top",
        size: { width: '300', height: '200' },
        variant: 'top-accent'
      });
      Router.replace("/dashboard/approve", "/dashboard/approve");
      return;
    }
    toast({
      title: 'Approval Failed',
      description: `Post approval failed for some reason ${response.statusText}`,
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: "top",
      size: { width: '300', height: '200' },
      variant: 'top-accent'
    })
  }

  const toast = useToast();
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  const { post } = router.query;
  const { data, isLoading } = useSWR(`/api/posts/${post}`, fetcher);
  const { status } = useSession();
  if (isLoading || status === "loading") return <h1>Loading...</h1>;
  if (data === null) return <h1>Post not found</h1>;
  if (data === undefined) return <h1>Post is not defined</h1>;
  if (status === 'unauthenticated') return <h1>You have to be signed in to see this page</h1>;
  return <div className='px-3 text-gray-700'>
    {
      data.approved === false && (user.role !== '' || user.role !== "Community Member") ?
        <div>
          <h2 className='mb-4'>Read the post below and approve</h2>
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
            <div className='text-center'>
              {parse(data.body)}
            </div>
          </div>

          <div className='flex justify-between m-3 p-4'>
            <button className='btn btn-success btn-block text-white text-2xl' onClick={handleAccept}>Approve</button>
            <button className='btn btn-danger btn-block text-white text-2xl' onClick={handleReject}>Reject</button>
          </div>
        </div>
        :
        <div> 
          <div className='text-center'>
          <h1 className='mb-4'>{data.title}</h1>
          <div>
            {parse(data.body)}
          </div>
          </div>
          <div className='flex gap-5 justify-between px-3'>
            <div><p>Asked by</p> <span className='text-xl'>{`${data.author.fname} ${data.author.lname}`}</span></div>
            <div><p>Date</p> <span className='text-wrap'>{data.time}</span></div>
            <div><p>Category</p><span className='text-wrap'>{data.category}</span></div>
          </div>
          <div className='flex gap-5 justify-evenly m-4 px-3'>
            <div className='flex items-center'>{true ? <AiOutlineLike className='hover:bg-gray-300 text-2xl' /> : <AiFillLike className='hover:bg-gray-300 text-2xl'/>} {data?.upvotes.length}</div>
            <div className='flex items-center '>{true ? <AiOutlineDislike className='hover:bg-gray-300 text-2xl' /> : <AiFillDislike className='hover:bg-gray-300 text-2xl'/>} {data?.downvotes.length}</div>
      
     
          </div>
        </div>
    }
  </div>
}

const Index = () => {
  return (
    <Sidebar>
      <Post />
    </Sidebar>
  )
}
export default Index;
