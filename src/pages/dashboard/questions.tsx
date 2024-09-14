import { useSession } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';
import { useSelector } from 'react-redux';
import { useState, FormEvent, ChangeEvent } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import dynamic from 'next/dynamic'
import { FaSpinner } from 'react-icons/fa';
import agricultureCategories from '../../../utils/category';
import Head from 'next/head';
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
  const [okay, setOkay] = useState(true)
  const user = useSelector((state: any) => state.user);
  const [postData, setPostData] = useState({
    title: '',
    body: '',
    author: {},
    category: '',
    hasImage: false,
  });
  const [busy, setBusy] = useState<boolean>(false);
  const toast = useToast();
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPostData((prev) => ({
      ...prev,
      [name]: value,
      author: user,
    })
    )
  }
  const handlequillchange = (value: string) => {
    const imageCount = (value.match(/<img/g) || []).length;
    if (imageCount === 1) {
      setPostData((prev) => {
        return {
          ...prev,
          hasImage: true
        }
      })
    } else {
      setPostData((prev) => {
        return {
          ...prev,
          hasImage: false
        }
      })
    }
    if (imageCount > 1) {
      toast({
        title: 'Too many images',
        description: "You cannot add more than one(1) image, if it doesn't delete automatically, delete one to proceed",
        status: 'warning',
        duration: 10000,
        isClosable: true,
        position: "top",
        size: { width: '300', height: '200' },
        variant: 'top-accent'
      })
      setOkay(false);
      setTimeout(() => {
        setOkay(true)
      }, 2000)
      return;
    }
    setOkay(true);
    setPostData((prev) => {
      return {
        ...prev,
        body: value
      }
    })
  }
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    if (postData.hasImage) {
      try {
        const response = await axios.post('/api/posts/create', postData);
        const post = await response.data.post;
        const message = response.data.message;
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
          });
          setBusy(false);
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
          hasImage: false,
        })
      } catch (error) {
        console.error(error);
      }
      setBusy(false)
      return;
    }
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
      });
      setBusy(false);
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
      hasImage: false,
    });
    setBusy(false);
  }

  return (
    <Sidebar>
      <Head>
        <title>Chakula Bora | Ask Question</title>
        <meta name="description" content="Ask a question" />
        <meta name="keywords" content="Chakulabora, Chakula-bora, Healthy food, Organic Agriculture, Agricultural Best practices" />
        <meta name="title" content="Chakulabora - Digital Platform" />
        <meta property="og:url" content="https://chakulabora.net/ask" />
        <meta property="og:type" content="website" />
        <meta name="og:locale" content={'{"locale": "en_us"}'} />
        <meta name="og:description" content="Ask a question" />
        <meta name="description" content="Chakulabora is the digital community of farmers celebrating the best practices around Agriculture and the Environment" />
        <meta property="og:title" content="Chakulabora - Digital Platform" />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta property="og:description" content="Ask a question" />
        <meta property="og:image" content="https://res.cloudinary.com/chakula-bora/image/upload/v1628582783/ChakulaBora/og-image.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://chakulabora.net/ask" />
        <meta property="twitter:title" content="Chakulabora - Digital Platform" />
        <meta property="twitter:description" content="Ask a question" />
        <meta property="twitter:image" content="https://res.cloudinary.com/chakula-bora/image/upload/v1628582783/ChakulaBora/og-image.png" />
        <meta name="msapplication-TileColor" content="#ffffff" />

      </Head>
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
                  {agricultureCategories.map((item: string) => <option value={item} key={item} />)}
                </datalist>
              </div>
            </div>
            <div className='form-group'>
              <label htmlFor='post'>Post</label>

              <div>
                <QuillNoSSRWrapper
                  modules={modules}
                  value={postData.body}
                  onChange={handlequillchange}
                  placeholder={placeholder}
                  formats={formats}
                  theme="snow"
                  scrollingContainer={scrollingContainer}
                  className='mb-3'
                />

              </div>
            </div>
            {okay &&
              busy ?
              <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded min-w-[100px] text-center">
                <FaSpinner className="animate-spin text-3xl" />.
              </button>
              :
              <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded min-w-[100px]">
                CREATE POST
              </button>

            }
          </div>
        </form>
      }
      {status === "unauthenticated" && <h2 className='font-semibold'>Login to ask questions </h2>}
    </Sidebar>
  )
}