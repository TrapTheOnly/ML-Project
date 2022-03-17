import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';


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
  const [threshold, setThreshold] = useState()
  const [width, setWidth] = useState()
  const [height, setHeight] = useState()
  const [resWidth, setResWidth] = useState()
  const [resHeight, setResHeight] = useState()
  async function getData(query) {
    await searchPage({ url: query, threshold: threshold, width: width, height: height }).then(res => {
      setRes(
        `Images count: ${res.data.images}
Paragraphs count: ${res.data.paragraphs}
Width: ${res.data.width}
Height: ${res.data.height}
Threshold: ${res.data.threshold}
Page text: \n${res.data.text}
      `)
      setImagesList(res.data.src)
      setWidth(res.data.width)
      setHeight(res.data.height)
      setResWidth(res.data.width)
      setResHeight(res.data.height)
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
      }}>
        <h1 style={{
          fontSize: 40,
          width: '100%',
          textAlign: 'center',
          color: "#41337a",
        }}>Webpage Scraper</h1>
        <Grid container spacing={2} style={{ marginLeft: "5%", width: '90%' }}>
          <Grid item xs={4} >
            <Typography id="input-slider" gutterBottom style={{ marginLeft: '5%' }}>
              Threshold
            </Typography>
            <Slider
              aria-label="Threshold"
              value={threshold}
              defaultValue={20}
              onChange={(event, value) => {
                setThreshold(value)
              }}
              getAriaValueText={(value) => { return `${value}` }}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              style={{
                width: '93%',
              }} />
          </Grid>
          <Grid item xs={4}>
            <Typography id="input-slider" gutterBottom style={{ marginLeft: '5%' }}>
              Width
            </Typography>
            <Slider
              aria-label="Width"
              value={width}
              defaultValue={120}
              onChange={(event, value) => {
                setWidth(value)
              }}
              getAriaValueText={(value) => { return `${value}` }}
              valueLabelDisplay="auto"
              min={100}
              max={500}
              style={{
                width: '93%',
              }} />
          </Grid>
          <Grid item xs={4}>
            <Typography id="input-slider" gutterBottom style={{ marginLeft: '5%' }}>
              Height
            </Typography>
            <Slider
              aria-label="Height"
              value={height}
              defaultValue={120}
              onChange={(event, value) => {
                setHeight(value);
              }}
              getAriaValueText={(value) => { return `${value}` }}
              valueLabelDisplay="auto"
              min={100}
              max={500}
              style={{
                width: '93%',
              }} />
          </Grid>
        </Grid>
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
        <ImageList variant="masonry" id="imgList"
          cols={() => { return document.getElementById("imgList").clientWidth - 10 / resWidth }} gap={3}
          rowHeight={resHeight} style={{
            width: "90%",
            marginLeft: "5%",
            marginTop: "2%"
          }}>
          {imagesList.map((item) => (
            <ImageListItem key={item} sx={{
              width: `${resWidth}px !important`,
              height: `${resHeight}px !important`,
            }}>
              <img
                className="imgOfList"
                style={{
                  objectFit: "fill",
                  borderRadius: 5,
                }}
                src={item}
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
