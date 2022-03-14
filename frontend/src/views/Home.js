import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useHistory } from 'react-router-dom';

import { searchPage } from "shared/request.js"
// import 'assets/scss/Home.scss';
import 'assets/css/Home.css';
import 'assets/css/index.css';
/*
:root {
  --light-blue: #6ea4bf;
  --dark-purple: #331e36;
  --purple: #41337a;
  --cyan: #c2efeb;
  --light-green: #ecfee8;
}
*/

function Home() {
  const [query, setQuery] = useState("")
  const [res, setRes] = useState("")
  const [imagesList, setImagesList] = useState([])
  async function getData(query) {
    await searchPage({ url: query }).then(res => {
      setRes(`Images count: ${res.data.images}\nParagraphs count: ${res.data.paragraphs}\nPage text: \n${res.data.text}`)
      setImagesList(res.data.src)
      console.log(res)
    })
  }
  return (
    <div style={{
      backgroundColor: '#41337a',
      minHeight: '85vh',
      minWidth: '100vw',
      paddingTop: '15vh',
      paddingBottom: '15vh'
    }}>
      <div style={{
        width: '60%',
        border: '1px solid #331e36',
        borderRadius: 10,
        backgroundColor: '#ecfee8',
        padding: '20px',
        minHeight: '70vh',
        marginLeft: '20%',
        // marginBottom: '5vh'
      }}>
        <h1 style={{
          fontSize: 40,
          width: '100%',
          textAlign: 'center',
          color: "#41337a",
        }}>Webpage Scraper</h1>
        <TextField id="outlined-search" label="URL to search" type="search" style={{
          width: "70%",
          marginLeft: "5%",
          height: 50
        }} onChange={(e) => setQuery(e.target.value)} />
        <Button style={{
          height: 55,
          width: "18%",
          marginLeft: '2%',
          color: '#6ea4bf',
          backgroundColor: '#ecfee8',
        }} onClick={() => getData(query)} variant="contained">
          Search
        </Button>
        <TextField
          id="outlined-read-only-input"
          label="Result"
          defaultValue="Search a URL to get the results"
          InputProps={{
            readOnly: true,
          }}
          multiline
          rows={10}
          style={{
            width: "90%",
            marginLeft: "5%",
            marginTop: "2%"
          }}
          value={res == "" ? "Search a URL to get the results" : res}
        />
        <ImageList sx={{ width: 520, minHeight: 200 }} cols={3} rowHeight={164} style={{
          width: "90%",
          marginLeft: "5%",
          marginTop: "2%"
        }}>
          {imagesList.map((item) => (
            <ImageListItem key={item}>
              <img
                style={{
                  // width: 164,
                  // height: 164,
                  objectFit: "fill",
                  // border: "1px solid #331e36",
                  borderRadius: 5,
                }}
                src={item}
                // srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                // alt={item.title}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
    </div >
  )
}

export default Home;
