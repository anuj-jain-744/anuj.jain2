import React from "react";
 
const DirectPay = () => {
  const buttonStyle = {backgroundColor: "#4CAF50", color: "white", padding: "10px 20px", fontSize: "16px", borderRadius: "5px", margin:200};
  const handleSubmit = (event) => {
    event.preventDefault();
    document.forms["redirectForm"].submit();
  };
 
  return (
    <form
      action="https://paytest.directpay.sa/SmartRoutePaymentWeb/SRPayMsgHandler"
      name="redirectForm"
      method="POST"
      target="_top"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="CardNumber" value="5123450000000008" />
      <input
        type="hidden"
        name="SecureHash"
        value="8b60f53ee372bf6fd8ad728f3a9ec6d3f7f7c331770b88493ac5429660d626f7"
      />
      <input
        type="hidden"
        name="ResponseBackURL"
        value="http://34.166.97.225:30099/Common/Utility/V1/Payment/Redirect"
      />
      <input type="hidden" name="MessageID" value="1" />
      <input type="hidden" name="MerchantID" value="DP00000032" />
      <input type="hidden" name="ExpiryDateMonth" value="01" />
      <input type="hidden" name="ExpiryDateYear" value="31" />
      <input type="hidden" name="SecurityCode" value="100" />
      <input type="hidden" name="CardHolderName" value="test" />
      <input type="hidden" name="CurrencyISOCode" value="682" />
      <input type="hidden" name="Version" value="2.0" />
      <input type="hidden" name="Quantity" value="1" />
      <input type="hidden" name="ThemeID" value="1000000001" />
      <input type="hidden" name="Language" value="en" />
      <input type="hidden" name="PaymentMethod" value="1" />
      <input type="hidden" name="Amount" value="2000" />
      <input type="hidden" name="TransactionID" value="1234452351013" />
      <input type="hidden" name="Loading" value="true" />
      <button type="submit" style={buttonStyle}>Pay</button>
    </form>
  );
};
 
export default DirectPay;