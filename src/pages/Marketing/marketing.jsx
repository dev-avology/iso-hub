import React from 'react';
import { Edit, Download, Megaphone } from 'lucide-react';

const socail = [
    {
        socailName: ' Social Media Kit 1',
    },
    {
        socailName: ' Social Media Kit 2',
    },
]

const Ebook = [
    {
        ebookName: ' Ebook 1',
    },
    {
        ebookName: ' Ebook 2',
    },
]
const Email = [
    {
        emailName: ' Email Outbound Copy 1',
    },
    {
        emailName: ' Email Outbound Copy 2',
    },
]
const  Flyers = [
    {
        flyersName: 'Flyers 1',
    },
    {
        flyersName: 'Flyers 2',
    },
]

const  Business  = [
    {
        businessName: 'Business Card 1',
    },
    {
        businessName: 'Business Card 2',
    },
]
const  Postcards  = [
    {
        postcardsName: 'Post card 1',
    },
    {
        postcardsName: 'Post card 2',
    },
]
export default function Marketing() {
  return (
    <>

<div class="mb-8 bg-yellow-400 rounded-lg p-6 shadow-lg"><div class="flex items-center space-x-3">  <Megaphone className="h-10 w-10 text-black"/>  <div><h1 class="text-3xl font-bold text-black"> Marketing</h1><p class="text-black/80 mt-1">Access and customize your marketing materials below:</p></div></div></div>




      <div className="markiting-wrap">
        <div className="marketing-heading flex items-center justify-between">
        <h3 className='text-white text-2xl font-bold'>
        Social Media
        </h3>
        <a href="javascript:(0)" className='w-fit bg-yellow-400 rounded py-2 px-5 font-semibold uppercase flex items-center justify-center hover:bg-yellow-600 gap-2 text-black'>
            Add
        </a>
        </div>
        {socail.map((socailN, index) => (
        <div className="markiting-list-wrap">
            <div className="markiting-list  group px-5 py-3 rounded flex gap-4 border border-gray-700 mt-4 bg-gray-700 cursor-pointer relative text-white">
                <h4 className='font-bold'>
                {socailN.socailName}
                </h4>
                 <div className="edit-delete-btn absolute right-5 hidden group-hover:block">
                              <div className="edit_data flex gap-2 items-center">
                                <a href="javascript:void(0)" className="hover:text-yellow-500">
                                  <Edit />
                                </a>
                                <a href="javascript:void(0)" className="hover:text-yellow-500">
                                  <Download />
                                </a>
                              </div>
                </div>
            </div>
        </div>
         ))}
      </div>




      <div className="markiting-wrap mt-10">
      <div className="marketing-heading flex items-center justify-between">
        <h3 className='text-white text-2xl font-bold'>
        Ebooks
        </h3>
        <a href="javascript:(0)" className='w-fit bg-yellow-400 rounded py-2 px-5 font-semibold uppercase flex items-center justify-center hover:bg-yellow-600 gap-2 text-black'>
            Add
        </a>
        </div>

        {Ebook.map((ebooks, index) => (
        <div className="markiting-list-wrap">
            <div className="markiting-list  group px-5 py-3 rounded flex gap-4 border border-gray-700 mt-4 bg-gray-700 cursor-pointer relative text-white">
                <h4 className='font-bold'>
                {ebooks.ebookName}
                </h4>
                 <div className="edit-delete-btn absolute right-5 hidden group-hover:block">
                              <div className="edit_data flex gap-2 items-center">
                                <a href="javascript:void(0)" className="hover:text-yellow-500">
                                  <Edit />
                                </a>
                                <a href="javascript:void(0)" className="hover:text-yellow-500">
                                  <Download />
                                </a>
                              </div>
                </div>
            </div>
        </div>
         ))}
      </div>

      <div className="markiting-wrap mt-10">


        <div className="marketing-heading flex items-center justify-between">
        <h3 className='text-white text-2xl font-bold'>
        Email Outbound Copy
        </h3>
        <a href="javascript:(0)" className='w-fit bg-yellow-400 rounded py-2 px-5 font-semibold uppercase flex items-center justify-center hover:bg-yellow-600 gap-2 text-black'>
            Add
        </a>
        </div>
        
        {Email.map((emails, index) => (
        <div className="markiting-list-wrap">
            <div className="markiting-list  group px-5 py-3 rounded flex gap-4 border border-gray-700 mt-4 bg-gray-700 cursor-pointer relative text-white">
                <h4 className='font-bold'>
                {emails.emailName}
                </h4>
                 <div className="edit-delete-btn absolute right-5 hidden group-hover:block">
                              <div className="edit_data flex gap-2 items-center">
                                <a href="javascript:void(0)" className="hover:text-yellow-500">
                                  <Edit />
                                </a>
                                <a href="javascript:void(0)" className="hover:text-yellow-500">
                                  <Download />
                                </a>
                              </div>
                </div>
            </div>
        </div>
         ))}
      </div>


      <div className="markiting-wrap mt-10">

        <div className="marketing-heading flex items-center justify-between">
        <h3 className='text-white text-2xl font-bold'>
        Flyers
        </h3>
        <a href="javascript:(0)" className='w-fit bg-yellow-400 rounded py-2 px-5 font-semibold uppercase flex items-center justify-center hover:bg-yellow-600 gap-2 text-black'>
            Add
        </a>
        </div>
        {Flyers.map((flyers, index) => (
        <div className="markiting-list-wrap">
            <div className="markiting-list  group px-5 py-3 rounded flex gap-4 border border-gray-700 mt-4 bg-gray-700 cursor-pointer relative text-white">
                <h4 className='font-bold'>
                {flyers.flyersName}
                </h4>
                 <div className="edit-delete-btn absolute right-5 hidden group-hover:block">
                              <div className="edit_data flex gap-2 items-center">
                                <a href="javascript:void(0)" className="hover:text-yellow-500">
                                  <Edit />
                                </a>
                                <a href="javascript:void(0)" className="hover:text-yellow-500">
                                  <Download />
                                </a>
                              </div>
                </div>
            </div>
        </div>
         ))}
      </div>


      <div className="markiting-wrap mt-10">

      <div className="marketing-heading flex items-center justify-between">
        <h3 className='text-white text-2xl font-bold'>
        Business Cards
        </h3>
        <a href="javascript:(0)" className='w-fit bg-yellow-400 rounded py-2 px-5 font-semibold uppercase flex items-center justify-center hover:bg-yellow-600 gap-2 text-black'>
            Add
        </a>
        </div>


        {Business.map((Businesss, index) => (
        <div className="markiting-list-wrap">
            <div className="markiting-list  group px-5 py-3 rounded flex gap-4 border border-gray-700 mt-4 bg-gray-700 cursor-pointer relative text-white">
                <h4 className='font-bold'>
                {Businesss.businessName}
                </h4>
                 <div className="edit-delete-btn absolute right-5 hidden group-hover:block">
                              <div className="edit_data flex gap-2 items-center">
                                <a href="javascript:void(0)" className="hover:text-yellow-500">
                                  <Edit />
                                </a>
                                <a href="javascript:void(0)" className="hover:text-yellow-500">
                                  <Download />
                                </a>
                              </div>
                </div>
            </div>
        </div>
         ))}
      </div>

      <div className="markiting-wrap mt-10">


        <div className="marketing-heading flex items-center justify-between">
        <h3 className='text-white text-2xl font-bold'>
        Postcards
        </h3>
        <a href="javascript:(0)" className='w-fit bg-yellow-400 rounded py-2 px-5 font-semibold uppercase flex items-center justify-center hover:bg-yellow-600 gap-2 text-black'>
            Add
        </a>
        </div>


        {Postcards.map((Postcardss, index) => (
        <div className="markiting-list-wrap">
            <div className="markiting-list  group px-5 py-3 rounded flex gap-4 border border-gray-700 mt-4 bg-gray-700 cursor-pointer relative text-white">
                <h4 className='font-bold'>
                {Postcardss.postcardsName}
                </h4>
                 <div className="edit-delete-btn absolute right-5 hidden group-hover:block">
                              <div className="edit_data flex gap-2 items-center">
                                <a href="javascript:void(0)" className="hover:text-yellow-500">
                                  <Edit />
                                </a>
                                <a href="javascript:void(0)" className="hover:text-yellow-500">
                                  <Download />
                                </a>
                              </div>
                </div>
            </div>
        </div>
         ))}
      </div>






    </>
  );
}
