package com.payment;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@Controller
@RequestMapping("/user")
public class MyController {

	@RequestMapping("/")
	public String openForm() {
		return "index";
	}
	
	 //creating order for payment
    @PostMapping("/create-order")
    @ResponseBody
    public String createOrder(@RequestBody Map<String , Object> data , Model model) throws RazorpayException {
    	System.out.println(data);
    	
    	//using this to get environment variable
    	String razorKeyId = System.getenv("razor_key_id");
    	String razorKeySecret = System.getenv("razor_key_secret");
    	
    	System.out.println(razorKeyId);

    	System.out.println(razorKeySecret);
    	
    	int amt = Integer.parseInt(data.get("amount").toString());
    	var client = new RazorpayClient(razorKeyId , razorKeySecret) ;
    	
    	JSONObject ob = new JSONObject();
    	ob.put("amount", amt * 100); //in paise
    	ob.put("currency", "INR");
    	ob.put("receipt" , "txn_235425");
    	
    	//creating new order
    Order order =	client.orders.create(ob);
    //if we want we can save this it in database
    System.out.println(order);
    
  
    	
    	
    	
    	
    	return order.toString();
    }
    
    
    //handler tp send environment variable in javascript file
    @RequestMapping("/sendenv")
    @ResponseBody
    public Map<String, String> sendEnv() {
        Map<String, String> mymap = new HashMap<>();
        
        String razorKeyId = System.getenv("razor_key_id");
    	String razorKeySecret = System.getenv("razor_key_secret");
    	
    	
    	
        mymap.put("razorKeyId",razorKeyId );
        mymap.put("razorKeySecret",razorKeySecret );
        return mymap;
    }
    
	
	
	
}
