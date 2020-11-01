import React, { Component } from 'react'

const product = {
    border: '1px solid rgb(206, 212, 218)',
    textDecoration: 'none',
    maxHeight: 'auto',
    paddingTop: '10px'
}

const productImg = {
    height: '75px',
    width: '125px',
    padding: '10px',
    float: 'left',
}

const productTitle = {
    fontFamily: 'Verdana, Geneva, sans-serif',
    fontSize: '15px',
    paddingTop: '7px',
    paddingLeft: '150px',
    textDecoration: 'none'
}

const productPrice = {
    textDecoration: 'none',
    paddingLeft: '150px',
    fontFamily: 'Verdana, Geneva, sans-serif'
}

const productLink = {
    textDecoration: 'none'
}

const desiredPriceInput = {
    paddingLeft: '150px',
    paddingTop: '1px',
    paddingBottom: '5px'
    
}

const desiredPriceInputStyle = {
    width: '200px'
}

const ProductList = ({ list }) => {
    return (
        <div style={product} >
            <a stye={productLink} href={list.url} target="_blank">
                <img style={productImg} src={list.imageUrl} />
                <h1 style={productTitle}>{list.productTitle.slice(0, 37)}...</h1>
                <p style={productPrice}>Current Price: {list.currentProductPrice.replace(/\s+/g, '')}</p>
            </a>
            <div style={desiredPriceInput}>
                <input style={desiredPriceInputStyle} type="number" min="0" value={list.desired_price} placeholder="Desired Price"/> 
            </div>
        </div>
        
    )
}

export default ProductList;