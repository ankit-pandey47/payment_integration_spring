//first request on server to create order

//pehle fetxh krke key id wgera niakl lete h


const paymentStart = () => {
	
	
	
console.log("hello")

    var razorKeyId = "";
    var razorKeySecret = "";

    // Fetch the Razorpay keys
    fetch('/user/sendenv')
    .then(response => response.json())
    .then(mymap => {
        razorKeyId = mymap.razorKeyId;
        razorKeySecret = mymap.razorKeySecret;
        console.log(razorKeyId);
        console.log(razorKeySecret);

        // Proceed with payment only after the keys are fetched
        initiatePayment(razorKeyId);
    });

    const initiatePayment = (razorKeyId) => {
        let amount = $("#payment_field").val();
        console.log(amount);

        if (amount === '' || amount === null) {
            alert("Amount is required");
            return;
        }

        // AJAX request to create order
        $.ajax({
            url: '/user/create-order',
            data: JSON.stringify({ amount: amount, info: 'order_request' }),
            contentType: 'application/json',
            type: 'POST',
            dataType: 'json',
            success: function (response) {
                // invoke when success
                console.log(response);

                if (response.status == 'created') {
                    // open payment form
                    var options = {
                        key: razorKeyId, // Use the key retrieved from the backend
                        amount: response.amount,
                        currency: "INR",
                        name: "Smart Contact Manager",
                        description: "Donation",
                        image: "https://avatars.githubusercontent.com/u/143313086?v=4",
                        order_id: response.id,
                        handler: function (response) {
                            console.log(response.razorpay_payment_id);
                            console.log(response.razorpay_order_id);
                            console.log(response.razorpay_signature);
                            alert("Congrats! Payment successful");
                        },
                        prefill: {
                            name: "",
                            email: "",
                            contact: ""
                        },
                        notes: {
                            address: "Code with Ankit"
                        },
                        theme: {
                            color: "#3399cc",
                        }
                    };

                    let rzp = new Razorpay(options);
                    rzp.on('payment.failed', function (response) {
                        console.log(response.error.code);
                        console.log(response.error.description);
                        console.log(response.error.source);
                        console.log(response.error.step);
                        console.log(response.error.reason);
                        console.log(response.error.metadata.order_id);
                        console.log(response.error.metadata.payment_id);
                        alert("Oops! Payment failed");
                    });

                    rzp.open();
                }
            },
            error: function (error) {
                // invoked when error
                alert("Something went wrong!");
            }
        });
    };
}
