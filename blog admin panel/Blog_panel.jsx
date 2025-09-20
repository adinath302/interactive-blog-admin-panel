import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import anime from '../../assets/anime.gif';

const Blog_panel = () => {

    const [page, setPage] = useState(1);
    // console.log("type of page", typeof (page));
    const [dark, setDark] = useState(false);
    const itemPerPage = 10;
    const [search, setSearch] = useState("");
    const [TotalNumber, setTotalNumber] = useState(0);

    const { data, isLoading, isError } = useQuery({  // UseQuery for API Fetching
        queryKey: ['repoData', page], // NOTE -  Query Key helps the Query to refetch the data when the query key changes
        queryFn: async () => {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${itemPerPage}`);  // NOTE - MODIFIED API for pagination
            if (!response.ok) {
                return new Error('Network response was not ok');
            }

            const Total = response.headers.get('x-total-count');
            if (Total) setTotalNumber(Number(Total));

            return await response.json();
        }
    })

    if (isLoading) return <p className='flex justify-center h-screen items-center'><img src={anime} alt="" srcset="" /></p>
    if (isError) return <p>Error...</p>
    // console.log(data.type);

    const pagenumbers = Math.ceil(TotalNumber / itemPerPage);  // Total Number of pages
    const pages = Array.from({ length: pagenumbers }, (_, i) => i + 1);
    console.log('type of Pages Array', typeof (pages[0]));


    // NOTE - Search Feature
    const FilterData = data.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) // checking if the search input is included in the title of the data or not if included then return true else return false
    );


    return (
        <div className={`px-3 flex flex-col justify-evenly min-h-screen p-1 gap-2 ${dark ? "bg-gray-900  text-white" : ""}`}>

            <div className='flex-col flex sm:flex-row gap-3 sm:gap-0 justify-between items-center mx-4 '>
                <div>
                    <h5 className='font-semibold'>Blog Panel</h5>
                </div>

                <div onClick={() => setDark(!dark)} className='border border-gray-400 p-1 rounded-full cursor-pointer'>
                    {dark ? <MdLightMode className='text-white' /> : <MdDarkMode />}
                </div>

                <div className='flex items-center'>
                    <input
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder='Search by title...'
                        value={search}
                        type="text"
                        className='focus:outline-none pr-2 text-sm border-l border-t border-b border-gray-400 p-1 rounded-bl-full rounded-tl-full' />
                    <div
                        className='border-t border-b border-r border-gray-400 p-1 rounded-tr-full rounded-br-full text- cursor-pointer'
                    >
                        <select
                            name=""
                            id=""
                            value={page}
                            onChange={(event) => {
                                setPage(Number(event.target.value))
                            }}
                            className='focus:outline-none'
                        >
                            <option value="">All Users</option>
                            {[...Array(10)].map((_, i) => (  // 
                                <option
                                    value={i + 1}
                                    key={i + 1}

                                >
                                    User {i + 1}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>
            </div>

            <div className={` grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2`}>
                {
                    FilterData.length === 0 ? ( // if no data found
                        <div className='col-span-full text-center text-gray-500 font-semibold' >
                            No results found
                        </div>
                    ) : (
                        FilterData.map((item) => (
                            <div key={item.id} className={`p-3 border rounded-md  ${dark ? "bg-gray-700 border-none" : ""}`}>
                                <h6>{item.title}</h6>
                                <p className='text-[10px]'>{item.body}</p>
                            </div>
                        ))
                    )
                }
            </div>

            <div className='flex justify-between flex-col md:flex-row  items-center mx-4 gap-3 md:gap-0'>
                <div className='flex gap-3 items-center '>
                    {
                        pages.map((num, index) => (
                            <div
                                key={index}
                                className={`${page === num ? "bg-red-500" : ""} ${dark ? "text-black" : ""} p-1 px-2 bg-gray-200 border rounded-md flex items-center cursor-pointer`}
                                onClick={() => setPage(num)}
                            >
                                {num}
                            </div>
                        )
                        )
                    }
                </div>
                <div className={`${dark ? "text-black" : "text-white"}`}>
                    <button
                        className={`p-1 px-3 font-semibold border rounded mx-1 cursor-pointer bg-gray-500 ${page === 1 ? 'hidden' : 'none'}`}
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    >Prev
                    </button>

                    <button
                        disabled={page === 10}
                        className={`p-1 px-3 font-semibold border rounded mx-4 cursor-pointer bg-gray-500 ${page === 10 ? 'hidden' : 'none'}`}
                        onClick={() => setPage((p) => (p + 1))} >
                        Next
                    </button>
                </div>
            </div>
        </div >
    )
}

export default Blog_panel;