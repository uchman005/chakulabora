import { useSession } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';
// import Script from 'next/script';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import useSWR from 'swr'
import axios from 'axios';
import { useDispatch } from 'react-redux';
const Table = dynamic(() => import("react-data-table-component"), {
    ssr: false,
});

const columns = [
    {
        name: 'Title',
        selector: (row: any) => row.title,
        wrap: true,
        cell: (row: any) => <Link href={`/post/${row.blob}`}>{row.title}</Link>
    },
    {
        name: 'Category',
        selector: (row: any) => row.category,
        cell: (row: any) => <Link href={`/post/${row.blob}`}>{row.category}</Link>
    },
    {
        name: 'Date',
        selector: (row: any) => row.time,
        wrap: true,
        cell: (row: any) => <Link href={`/post/${row.blob}`}>{row.time}</Link>

    },
];

const fetcher = async (url: string) => {
    const res = await axios.post(url);
    const data = res.data;
    return data;
}

export default function Index() {
    const { data, isLoading } = useSWR('/api/posts/find', fetcher);
    return (
        <>
            <Sidebar>
                <div className='row bg-gray-300 min-h-[100vh]'>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-7 bg-gray-200 mb-md-1">

                        <Table progressPending={isLoading || !data ? true : false} pagination striped={true} responsive={true} columns={columns} data={data} />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-5 bg-gray-200">
                        <Table pagination striped progressPending={!isLoading || data ? false : true} responsive={true} columns={columns} data={data} />
                    </div>
                </div>
            </Sidebar>
        </>
    )
}

