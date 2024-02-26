import React from 'react';
import parse from 'html-react-parser';
import SectionBlock from '../ui/section-block';

export default function BlogDetails({ blog }) {
  let parsedData: any = blog?.desc ? parse(blog.desc) : "";

  return (
        <SectionBlock>
          {
            parsedData &&
            <h1>{parsedData}</h1>
          }
        </SectionBlock>
  )
}
