import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getCartItems, removeCartItem, onSuccessBuy } from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';
import { Empty, Result } from 'antd';
import Paypal from '../../utils/Paypal';
import "./Sections/CartPage.css"
import { Row, Col} from 'antd';
import { Link } from 'react-router-dom';
import PayPal from "./PayPal.svg";


function CartPage(props) {
    const dispatch = useDispatch();

    const [Total, setTotal] = useState(0)
    const [ShowTotal, setShowTotal] = useState(false)
    const [ShowSuccess, setShowSuccess] = useState(false)

    useEffect(() => {

        let cartItems = []
        //리덕스 User state안에 cart 안에 상품이 들어있는지 확인 
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id)
                })
                dispatch(getCartItems(cartItems, props.user.userData.cart))
                    .then(response => { calculateTotal(response.payload) })
            }
        }
    }, [props.user.userData])


    let calculateTotal = (cartDetail) => {
        let total = 0;

        cartDetail.map(item => {
            total += parseInt(item.price, 10) * item.quantity
        })

        setTotal(total)
        setShowTotal(true)

    }


    let removeFromCart = (productId) => {

        dispatch(removeCartItem(productId))
            .then(response => {

                if (response.payload.productInfo.length <= 0) {
                    setShowTotal(false)
                }

            })

    }

    const transactionSuccess = (data) => {
        dispatch(onSuccessBuy({
            paymentData: data,
            cartDetail: props.user.cartDetail
        }))
            .then(response => {
                if (response.payload.success) {
                    setShowTotal(false)
                    setShowSuccess(true)
                }
            })
    }

    console.log("props:",props);
    return (
        <div style={{ width: '80%', margin: '3rem auto' }}> {/** 80% 3rem auto */}

            <h1 style={{fontWeight:'bold'}}>My Cart</h1>
            <div className='cart-container' style={{display:'flex'}}>
                
                <div className='cartblock-container' style={{width: '60%', marginRight:'1em'}}>
                    {/* 아이템 개수에 맞게 자동으로 생성되게 만들기 */}
                    <UserCardBlock products={props.user.cartDetail} removeItem={removeFromCart} />
                </div>
                
                <div className='cart-info' style={{width:'40%'}}>
                    <div className='cart-info-summary' style={{marginBottom:'1em', padding:'0.5em 1em'}}>
                        <h2>주문요약</h2>
                        {ShowTotal ?
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                            <h4>주문품목 정가: ${Total}</h4>
                        </div>
                        : ShowSuccess ?
                            <Result
                                status="success"
                                title="Successfully Purchased Items"
                            />
                            :
                            <>
                                <br />
                                <Empty description={false} />
                            </>
                        }
                        
                        
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                            <h4>배송비 </h4><h4>무료</h4> {/* 합계 금액에 따라서 무료인지 아닌지 ? : 이용하기*/}
                        </div>
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                            <h2>합계</h2><h2>${Total}원</h2> {/* 배송비 포함 금액 나타내기 */}
                        </div>
                        {ShowTotal &&
                            <Paypal
                                total={Total}
                                onSuccess={transactionSuccess}
                            />
                        }
                    </div>
                    
                    <div className='cart-info-policy' style={{padding:'0.5em 1em'}} >
                        <h2>배송 및 반품 정책</h2>
                        <div style={{marginBottom: '1em'}}>
                            <Link to="/deliverypolicy"><span style={{marginRight: '1em'}}>배송정책</span></Link>
                            <span><a href="/deliverypolicy">교환, 반품 및 환불</a></span>
                        </div>
                        <h2>결제 방식</h2>
                        <img style={{width: '80px', height: '40px'}} src={PayPal} />
                    </div>

                </div>
                

            </div>

            

            {/* {ShowTotal ?
                <div style={{ marginTop: '3rem' }}>
                    <h2>Total Amount: ${Total}</h2>
                </div>
                : ShowSuccess ?
                    <Result
                        status="success"
                        title="Successfully Purchased Items"
                    />
                    :
                    <>
                        <br />
                        <Empty description={false} />
                    </>
            }


            {ShowTotal &&
                <Paypal
                    total={Total}
                    onSuccess={transactionSuccess}
                />
            } */}

        </div>
    )
}

export default CartPage
