import client from '@/framework/client';
import { DEFAULT_PAGE_CODE } from '@/framework/utils/constants';
import React, { useEffect, useState } from 'react';
import SectionBlock from '../ui/section-block';
import parse from 'html-react-parser';
import { toast } from 'react-toastify';

export default function HomeContent() {
  const [pageContent, setPageContent] = useState('');
  useEffect(() => {
    getPageContent();
  }, []);

  async function getPageContent() {
    let parsedData: any = '';
    // let storeCode = getStore();
    try {
        const data = await client.navigation.get(DEFAULT_PAGE_CODE);
        
        if (data) {
          parsedData = parse(data?.description?.description);
        }
        setPageContent(parsedData);
    } catch (error) {
        toast.error(error?.message);
    }
   
  }

  return (
    <SectionBlock>
      <p>{pageContent}</p>
    </SectionBlock>
  );
}
