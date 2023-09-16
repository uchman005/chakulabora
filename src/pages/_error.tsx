import Link from 'next/link';
import Head from 'next/head';
function Error({ statusCode }: any) {
    return (
        <div className='flex flex-col items-center justify-center gap-4 min-h-[100vh] p-4'>
            <Head>
                <title>Chakula-bora | Error</title>
            </Head>
            <p className='text-center text-2xl text-gray-600'>
                {statusCode
                    ?
                    statusCode === 404 ?
                        `An error occurred on server because the resource you are looking for does not exist on this server`
                        : `An error ${statusCode} occurred on server`
                    : 'An error occurred on your browser, check your connection'}
            </p>
            <Link href={"/"} className='text-center text-3xl text-success'>Go back to home</Link>
        </div>
    )
}

Error.getInitialProps = ({ res, err }: any) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode }
}

export default Error
