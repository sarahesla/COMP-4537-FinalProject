import Result from "./Result";
import fs from 'fs'
import jwt from "jsonwebtoken"
let privateKey = fs.readFileSync("./src/security/private.key", "utf8");
let publicKey = fs.readFileSync("./src/security/public.key", "utf8");

export default class Helper{
	
	constructor(){}
	
	
	static genId(){
		const length = 10;
		let seedText = "newUser";
		let chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
		seedText.toUpperCase() +
		"abcdefghijklmnopqrstuvwxyz" +
		seedText +
		"123456789";
		let charLength = chars.length;
		var result = "";
		for (var i = 0; i < length; i++) {
			result += chars[Math.floor(Math.random() * charLength)];
		}   
		
		return result;
		
	}
	
	// middleware function
	static verifyAuthToken(req, res, next){
		const authToken = req.headers["authorization"];
		
		if (typeof authToken !== "undefined") {
			req.token = authToken;
			console.log(req.token);
			//next middleware
			next();
		} else {
			res.status(400).json({ error: "Unauthorized.", userAuthState: false });
		}
	}
	
	
	static async jwtVerifyUser(authToken, key){
		return new Promise((resolve, reject) =>{
			jwt.verify(authToken, publicKey, (err, currentUser) =>{
				if(err) reject(Result.Error("User is not authorized."))
				resolve(currentUser)
			})
		})
	}
	
	// middleware function
	static async verifyRequest(req, res, next, db){
		const requestToken = req.headers["x-api-key"];
		console.log("REQUEST TOKEN: " ,requestToken)
		try{
			if (typeof requestToken === "undefined") {
				throw {message: "Unauthorized1"}
			}
			let user = await db.select("admin", "admin_id", {"admin_id": requestToken})
			if(user.length == 0){
				throw {message: "Unauthorized2"}
			}
			let url = req.url
			if(url.endsWith("/") && url != "/"){
				url = url.substring(0, url.length - 1)
			}
			let insert_result = await db.insert("api_request", ["admin_id", "endpoint", "method"], [requestToken, url, req.method])
			//next middleware
			next()
		}catch(e){
			console.log(e)
			res.status(400).json({ error: "Unauthorized.", userAuthState: false });
		}
	}
	
	
	
}