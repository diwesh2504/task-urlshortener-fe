import React, { useState } from 'react'
import {XLg} from "react-bootstrap-icons"
function App() {
  const [urls, setUrls] = useState([]);
  const [notification, setNotification] = useState("");
  const handleDelete=async (e)=>{
    let btnID=e.target.id;
    var r=await fetch(`https://urlshortenerb.herokuapp.com/delete/${btnID}`,{
      method:"DELETE",
      headers:{"Content-type":"application/json"},
      body:JSON.stringify({"id":btnID})
    })
    var res=await r.json();
    if(r.status===200){
      getAll();
    }
    setNotification(res.message);
    document.getElementById("notification").style.display="block";
      setTimeout(()=>{
        document.getElementById("notification").style.display="none";
      },1500)
   
  }

  const onShorten=async (e)=>{
    e.preventDefault();
    var longurl=document.getElementById("longurl").value;
    console.log("LONG URL INPUT:",longurl)
    var r=await fetch("https://urlshortenerb.herokuapp.com/shorten",{
      method:"POST",
      headers:{
        "Content-type":"application/json"
      },
      body:JSON.stringify({longurl})
    })
    var res=await r.json();
    console.log("RESPONSE FROM BACKEND",res)
    document.getElementById("longurl").value=""
    setNotification(res.message)
    document.getElementById("notification").style.display="block"
    setTimeout(()=>{
      document.getElementById("notification").style.display="none"
    },1500)
    if(r.status===200){getAll()}
  }
  const getAll=async (e)=>{
    var r=await fetch("https://urlshortenerb.herokuapp.com/allurls")
    var res=await r.json()
    if(r.status===200){
      
        setUrls(res.data)
      
      
    }
    
    
  }
  React.useEffect(()=>{
    getAll();
  },[urls.length])
  return (
    <>
    <div>
      <h1 className="display-1">URL Shortener</h1>
      <div style={{marginTop:"10px"}}>
          <form className="form-row" onSubmit={onShorten}>
            <div className="col">
              <input type="text" className="form-control" id="longurl" placeholder="Enter the URL here" />
            </div>
            <div className="col"> 
              <button type="submit" className="btn btn-success">Shorten</button>
            </div>
          </form>
      </div>
      <div id="list_of_url" style={{marginTop:"10px",position:"absolute"}}>
          {urls.length!==0 ?<div className="table-response-sm">
      <table className="table table-striped">
            <thead>
              <th scope="col">Sl No</th>
              <th scope="col">Long URL</th>
              <th scope="col">Shortened URL</th>
              <th scope="col">Action </th>
            </thead>
            <tbody>
              
                {urls.map((entry,idx)=>{
                  return (
                    <tr scope="row" style={{width:"40px"}}>
                      <td>{idx+1}</td>
                      <td  style={{wordWrap:"break-word",minWidth: "10vh",maxWidth:"100vh"}}>{entry.longurl}</td>
                      <td><a href={entry.shortened}>{entry.shortened}</a></td>
                      <td>
                        <div style={{margin:"auto"}}>
                        <button  onClick={handleDelete} id={entry._id} className="btn btn-danger btn-sm" aria-label="Xlg">
                         Delete <XLg/>
                        </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              
            </tbody>
          </table>
    </div>:<div style={{marginTop:"10px",width:"40vh"}}className="alert alert-info" role="alert">No URLs to Show</div>}
      </div>
    </div>
    <div id="notification" style={{position:"fixed",bottom:"30px",borderRadius:"25px",left:"45%",padding:"10px",backgroundColor:"darkslategray",color:"antiquewhite",display:"none"} }>{notification}</div>
    </>
  )
}

export default App
