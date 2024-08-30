import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import axios from 'axios';
import parse from 'html-react-parser'
import Head from 'next/head';
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
        wrap: true,
        cell: (row: any) => <Link href={`/post/${row.blob}`}>{parse(row.category)}</Link>
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
export default function Approve() {
    const { data, isLoading } = useSWR('/api/posts/unapproved', fetcher);

    return (
        <Sidebar>
            <Head>
                <title>Chakula-bora | Approve</title>
            </Head>
            <div className=''>
                <Table progressPending={isLoading || !data ? true : false} pagination striped={true} responsive={true} columns={columns} data={data} />
            </div>
        </Sidebar>
    );
}