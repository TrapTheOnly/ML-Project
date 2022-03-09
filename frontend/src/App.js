import '@material/react-text-field/dist/text-field.css';
import '@material/react-button/dist/button.css';
import React, { useState } from 'react';
import TextField, { HelperText, Input } from '@material/react-text-field';
import Button from '@material/react-button';
import MaterialIcon from '@material/react-material-icon';
import axios from 'axios';
/*
:root {
  --light-blue: #6ea4bf;
  --dark-purple: #331e36;
  --purple: #41337a;
  --cyan: #c2efeb;
  --light-green: #ecfee8;
}
*/

function App() {
  const [query, setQuery] = useState("")
  const [res, setRes] = useState({})
  async function getData(query) {
    await axios.post('http://localhost:5000/', { url: query })
      .then((response) => {
        setRes(response);
        console.log(response);
      })
  }
  return (
    <div style={{
      backgroundColor: '#6ea4bf',
      minHeight: '85vh',
      minWidth: '100vw',
      paddingTop: '15vh'
      // marginTop: 0
    }}>
      <div style={{
        width: '60%',
        border: '1px solid #331e36',
        borderRadius: 10,
        backgroundColor: '#41337a',
        padding: '20px',
        minHeight: '70vh',
        marginLeft: '20%',
      }}>
        <h1>Webpage Scraper</h1>
        <TextField
          outlined
          label='URL'
          helperText={<HelperText>Webpage to search</HelperText>}
          onTrailingIconSelect={() => setQuery('')}
          trailingIcon={<MaterialIcon role="button" icon="clear" />}
        >
          <Input
            style={{
              color: '#6ea4bf'
            }}
            value={query}
            onChange={(e) => setQuery(e.target.value)} />
        </TextField>
        <Button style={{
          color: '#6ea4bf',
          backgroundColor: '#ecfee8',
        }} onClick={() => getData(query)}>
          Search
        </Button>
        <p>
          URL: {
            res.data ? res.data.url : ""
          }<br></br>
          Images count: {
            res.data ? res.data.images : ""
          }<br></br>
          Paragraphs count: {
            res.data ? res.data.paragraphs : ""
          }<br></br>
          Image sources: {
            res.data ? res.data.src : ""
          }
        </p>
      </div>
    </div>
  )
}

export default App;
