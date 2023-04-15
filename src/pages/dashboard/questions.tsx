import { useSession } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import dynamic from 'next/dynamic'

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

// getContents(index: Number = 0, length: Number = remaining): Delta
const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
}
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  'font',
  'header',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
]
const placeholder = "Please be as detailed as possible. You can Use Images(Size less than 10mb) to further describe your point."
const scrollingContainer = "auto-grow"

export default function Index() {
  const { status } = useSession();
  
  const user = useSelector((state: any) => state.user);
  const [postData, setPostData] = useState({
    title: '',
    body: '',
    author: user,
    category: '',
  });

  const toast = useToast();
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setPostData((prev) => ({
      ...prev,
      [name]: value,
    })
    )
  }
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const response = await axios.post("/api/posts/create", postData);
    const post = response.data.post;
    const message = response.data.message
    if (post === null) {
      toast({
        title: 'Post creation Failed',
        description: message,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "top",
        size: { width: '300', height: '200' },
        variant: 'top-accent'
      })
      return;
    }
    toast({
      title: 'Post created successfully',
      description: message,
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: "top",
      size: { width: '300', height: '200' },
      variant: 'top-accent'
    })
    setPostData({
      title: '',
      body: '',
      author: user,
      category: '',
    })
  }
  
  return (
    <Sidebar>
      {status === "authenticated" &&
        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <div className='form-group'>
                <label htmlFor='title'>Title</label>
                <input type='text' required name='title' id='title' value={postData.title} onChange={handleChange} className='form-control' />
              </div>
              <div className='form-group'>
                <label htmlFor='category'>Category</label>

                <input list="category" required placeholder='Select a category' className='form-control' name='category' value={postData.category} onChange={handleChange} />
                <datalist id="category">
                  <option value="Aqua culture" />
                  <option value="Animal Husbandry" />
                  <option value="Apery" />
                  <option value="Poultry" />
                  <option value="Crop Production" />
                </datalist>
              </div>
            </div>
            <div className='form-group'>
              <label htmlFor='post'>Post</label>

              <div>
                <QuillNoSSRWrapper
                  modules={modules}
                  value={postData.body}
                  onChange={(value) => {
                    setPostData((prev) => {
                      return {
                        ...prev,
                        body: value
                      }
                    })
                  }}
                  placeholder={placeholder}
                  formats={formats}
                  theme="snow"
                  scrollingContainer={scrollingContainer}
                  className='mb-3'
                />

              </div>
            </div>
            <button className='btn btn-block btn-outline-info '>Submit</button>
            {JSON.stringify(user)}
          </div>
        </form>
      }
      {status === "unauthenticated" && <h2 className='font-semibold'>Login to ask questions </h2>}
    </Sidebar>
  )
}