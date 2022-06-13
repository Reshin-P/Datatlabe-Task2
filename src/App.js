import './App.css'
import sample from "./sample.json";
import React, { useEffect, useState } from "react";
import { Button, Container, Table, Row, Col, Form, Dropdown, DropdownButton, InputGroup } from "react-bootstrap";




export default function App() {
  const [fulldata, setFulldata] = useState([])
  const [result, setResult] = useState([])
  const [date1, setDate1] = useState(null)
  const [date2, setDate2] = useState(null)
  const [currency, setCurrency] = useState([])
  const [dateError, setDateError] = useState(false)
  const [dateShow, setDateShow] = useState(true)




  useEffect(() => {

    setResult(sample.message.data["649"])
    setFulldata(sample.message.data["649"])

    if (fulldata) {
      let result = []
      fulldata.forEach((item) => {
        if (item.details.currencySymbol) {
          if (!result.includes(item.details.currencySymbol)) {
            result.push(item.details.currencySymbol)
          }
        }
      })
      setCurrency(result)
    }
  }, [fulldata]);



  //TO SORT DATA DATE WISE
  const sortDate = () => {

    if (date1 && date2) {

      let data = fulldata.filter((obj) => {
        if (obj.dateCreated >= date1 && obj.dateCreated <= date2) {
          return obj
        }
      })
      setDateError(false)
      setResult(data)
    } else {
      setDateError("red")
    }

  }



  //TO SORT BY CURRENCY

  const sortCurrency = (currency) => {

    let data = fulldata.filter((item) => {
      if (item.details.currencySymbol === currency) {
        return item
      }
    })
    setResult(data)

  }


  // TO GROUP JSON DATA BY CREATED DATE AND CURRENCY

  const groupByDate = () => {
    setDateShow(true)

    let cache = []
    let datas = []

    let c = 0

    fulldata.map((item) => {

      let exist = cache.filter((data) => {
        if (data.date === item.dateCreated && data.currencySymbol === item.details.currencySymbol) {
          return data
        }
      })

      if (exist.length !== 0) {
        datas.forEach((value) => {
          if (value.dateCreated === item.dateCreated && value.details.currencySymbol === item.details.currencySymbol) {

            value.details.sales = value.details.sales + item.details.sales


          }
        })
      } else {
        datas.push(item)
        cache.push({ "date": item.dateCreated, "currencySymbol": item.details.currencySymbol })
      }
    })


    setResult(datas)


  }


  //TO GROUP JSON BY CAMPAIN ID 

  const groupByCampainID = () => {
    let cache = []
    let datas = []
    fulldata.map((item) => {
      if (cache.includes(item.details.currencySymbol)) {
        datas.map((value) => {
          if (value.details.currencySymbol === item.details.currencySymbol) {
            value.details.sales = value.details.sales + item.details.sales
          }
        })
      } else {
        datas.push(item)
        cache.push(item.details.currencySymbol)
      }
    })
    setDateShow(false)
    setResult(datas)
  }


  const check = () => {
    console.log("full", fulldata);
  }
  return (
    <>

      <Container fluid className=" topbar">
        <Row className="mt-5 MAINROW">
          <Col sm={12} md={7} lg={7} xl={7}>
            {dateError && <p style={{ color: 'red' }}>choose date</p>}
            <input style={{ border: `2px solid ${dateError ? dateError : "white"}` }} onChange={(e) => {
              setDate1(e.target.value)
            }} type="date" />
            <input style={{ border: `2px solid ${dateError ? dateError : "white"}` }} onChange={(e) => {
              setDate2(e.target.value)
            }} type="date" />
            <Button className="ml-3" onClick={sortDate} >Go</Button>

          </Col>
          <Col className='right-column' sm={12} md={5} lg={5} xl={5}>

            {/* <Button className="primary" onClick={() => {
              setResult(fulldata)
              setDateShow(true)
              setDateError(false)
            }} >Reset</Button> */}

            <DropdownButton id="dropdown-basic-button" title="Sort By Currency ">
              {currency && currency.map((item) => (
                <Dropdown.Item onClick={() => {
                  sortCurrency(item)
                }} key={item}>{item}</Dropdown.Item>
              ))}

            </DropdownButton>
            <DropdownButton id="dropdown-basic-button" title="Group By ">
              <Dropdown.Item onClick={groupByDate}>Date</Dropdown.Item>
              <Dropdown.Item onClick={check}>check</Dropdown.Item>
              <Dropdown.Item onClick={groupByCampainID}>CampaignId</Dropdown.Item>

            </DropdownButton>
          </Col>
        </Row>
      </Container>
      <div className="App">
        <Table striped bordered hover className="mt-5">
          <thead>

            <tr>

              {dateShow && <th>Date</th>}
              <td>Campaign Id</td>
              <th>Clicks</th>
              <th>CPC</th>
              <th>Partials</th>
              <th>Currency </th>
              <th>Declines</th>
              <th>Sales</th>
              <th>Step 1 Commission</th>
              <th>Upsells</th>
              <th>Net Revanue</th>

            </tr>
          </thead>
          <tbody>

            {result && result.map((
              { dateCreated, campaignId,
                details: { netTotal, currencySymbol, clicks, upsells, cpcCommission, partials, declines, sales, step1Commission } },
              index
            ) => (

              <tr key={index}>

                {dateShow && <td>{dateCreated}</td>}
                <td>{campaignId}</td>
                <td>{clicks}</td>
                <td>{cpcCommission}</td>
                <td>{partials}</td>
                <td>{currencySymbol}</td>
                <td>{declines}</td>
                <td>{sales}</td>
                <td>{step1Commission}</td>
                <td>{upsells}</td>
                <td>{netTotal}</td>

              </tr>
            ))}

          </tbody>
        </Table>

      </div>
    </>

  );
}
