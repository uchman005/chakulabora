import { useSession } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';
import { useSelector } from 'react-redux';
import { useState, FormEvent, ChangeEvent, useRef } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import dynamic from 'next/dynamic'
import { FaSpinner } from 'react-icons/fa';
import agricultureCategories from '../../../utils/category';
import Head from 'next/head';
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import { AbortableFileInput, IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { OverrideParameterType } from '../../../interface';

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
    ['link'],
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
    image: ''
  });
  const [busy, setBusy] = useState<boolean>(false);
  const toast = useToast();
  const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
  const authenticationEndpoint = process.env.NEXT_PUBLIC_AUTHENTICATION_ENDPOINT;
  let reftest = useRef<AbortableFileInput>(null);
  const [isUploading, setIsUploading] = useState<boolean | null>(null);
  const [uploadProgress, setUploadProgress] = useState<ProgressEvent>();
  const [uploadedImageSource, setUploadedImageSource] = useState<string>();

  const [, setoverrideParametersValue] = useState<OverrideParameterType>();

  const onSuccess = (res: IKUploadResponse) => {
    setUploadedImageSource(res.url);
    setPostData((prev) => ({ ...prev, image: res.url }));
    setIsUploading(false);
  };

  const authenticator = async () => {
    try {
      if (authenticationEndpoint) {
        // You can pass headers as well and later validate the request source in the backend, or you can use headers for any other use case.
        const response = await fetch(authenticationEndpoint);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
      } else throw new Error(`Authentication endpoint is required`);
    } catch (error: any) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  const onUploadStart = (_: ChangeEvent<HTMLInputElement>): void => {
    setIsUploading(true);
  };

  const onUploadProgress = (e: ProgressEvent) => {
    setUploadProgress(e);
  };

  const onOverrideParameters = (file: File) => {
    setoverrideParametersValue({
      fileNameOnLocalSystem: file.name,
    });
    return {
      fileName: "chakulabora-post.png",
    };
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPostData((prev) => ({
      ...prev,
      [name]: value,
      author: user,
    })
    )
  }
  const handlequillchange = (value: string): void => {
    setPostData((prev) => {
      return {
        ...prev,
        body: value
      }
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(postData);

    setBusy(true);
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
      image: ''
    });
    setUploadedImageSource('');
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
            <div className="form-group">
              <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
                <label className="mr-4">Image: </label>
                <IKUpload
                  fileName="test.jpg"
                  tags={["Chakulabora", "Regenerative Agriculture"]}
                  customCoordinates={"10,10,10,10"}
                  isPrivateFile={false}
                  useUniqueFileName={true}
                  responseFields={["tags"]}
                  folder={"/chakulabora/posts"}
                  onSuccess={onSuccess}
                  ref={reftest}
                  className="file-upload-ik"
                  onUploadProgress={onUploadProgress}
                  onUploadStart={onUploadStart}
                  overrideParameters={onOverrideParameters}
                  accept="image/*"
                />
                {isUploading !== null ? (
                  <p>
                    {isUploading
                      ? `...Uploading (${uploadProgress ? (uploadProgress.type ? ((uploadProgress.loaded / uploadProgress.total) * 100).toFixed(2) + "%)" : "") : ""
                      }`
                      : null}
                  </p>
                ) : (
                  <></>
                )}
                {isUploading && (
                  <button className="btn btn-danger"
                    onClick={() => {
                      reftest.current?.abort();
                      setIsUploading(null);
                    }}
                  >
                    Cancel
                  </button>
                )}

                {uploadedImageSource && (
                  <div className="relative dimension">
                    <IKImage
                      urlEndpoint={urlEndpoint}
                      src={uploadedImageSource}
                      className="w-[40%]"
                      alt="test-image"
                      width={400}
                      height={400}
                    />
                  </div>
                )}

              </ImageKitProvider>
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