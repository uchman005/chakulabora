import Link from 'next/link';
import Head from 'next/head';
function Error({ statusCode }: any) {
    return (
      <div className="bg-[url('/background.jpg')] bg-cover bg-fixed text-xl text-gray-900">
        <div className='flex flex-col items-center justify-center gap-4 min-h-[100vh] p-4'>
            <Head>
                <title>Chakula Bora | Error</title>
            </Head>

            <p className='text-center text-3xl max-w-4xl'>
                {statusCode
                    ?
                    statusCode === 404 ?
                        `An error occurred on server because the resource you are looking for does not exist on this server`
                        : `An error ${statusCode} occurred on server`
                    : 'An error occurred on your browser, check your connection'}
            </p>
            <Link href={"/"} className='text-center text-3xl text-blue-700'>Go back to home</Link>
            </div>
        </div>
    )
}

Error.getInitialProps = ({ res, err }: any) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode }
}

export default Error
