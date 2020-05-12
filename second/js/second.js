window.onload = function(){
	//登录页面
	//设置焦点与失去焦点
	//用户名
	var usernameText = document.getElementById("username");
	usernameText.onfocus = function(){
			this.setAttribute("placeholder","用户名");
			this.setAttribute("class","black");
	}
	usernameText.onblur = function(){
		if(this.value){
			this.setAttribute("placeholder","用户名");
			this.setAttribute("class","black");
		}else{
			this.setAttribute("placeholder","请输入用户名");
			this.setAttribute("class","red");
		}
	}
	
	//密码框
	var passwordText = document.getElementById("password");
	passwordText.onfocus = function(){
			this.setAttribute("placeholder","密码");
			this.setAttribute("class","black");
	}
	passwordText.onblur = function(){
		if(this.value){
			this.setAttribute("placeholder","密码");
			this.setAttribute("class","black");
		}else{
			this.setAttribute("placeholder","请输入密码");
			this.setAttribute("class","red");
		}	
	}
	
	//主页面
	//获取登录按钮
	var logIn = document.getElementById("logIn");
	var userId, username, password, loginInfor, userInfo;
	var result = "failed";
	//当登录成功时获取用户信息
	function getInfo(result){
		if(result == "success"){
				 axios.get(baseURL+'/user/getInfo?userId='+loginInfor.userId)
				 			.then(function(response){
								if(response.status == 200){
									
									userInfo = response.data;
									document.getElementById("photo").src = userInfo.info.avatar;
									getArticle(loginInfor.userId,allNum,allNum+3);
									//allNum记录文章总数
									allNum += 4;
								}else if(response.status == 400){
									alert("请求方式错误");
								}else{
									alert("服务端错误");
								}
				 			})
				 			.catch(function(err){
				 				console.log(err);
				 			})
		}
	}
	//为登录按钮绑定单击响应函数
	var baseURL = 'http://47.97.204.234:3000';
	var allNum = 0;//记录文章数量
	var articles; //文章信息
	logIn.onclick = function(){
		//获取当前输入的用户名和登录密码
		username = document.getElementById("username").value;
		password = document.getElementById("password").value;
		//发送登录请求
		axios.post(baseURL+'/user/login',"username="+username+"&password="+password)
					.then(function(response){
						// 获取登录信息 loginInfor
						loginInfor = response.data;
						result = loginInfor.result;
						if(result == "success"){
						/*成功则切换页面*/
							if(response.status == 200){
								document.getElementsByClassName("main-page hidden")[0].className = "main-page";
								document.getElementsByClassName("logIn-page")[0].style.display = "none";
								//获取用户信息
								getInfo(result);
								//
							}else if(response.status == 400){
								alert("请求方式错误");
							}else{
								alert("服务端错误");
							}
						}else{//失败则弹出说明
								alert(loginInfor.message);	
						}	
					})
					.catch(function(err){
						console.log(err);
					})				
	 }	 
	 //导航栏
	 var nav = document.getElementById("inner-header");
	 window.onscroll = function(){
	 	var header = document.getElementById("inner-header");
	 	nav.style.left = "-"+document.documentElement.scrollLeft+"px";
	 	if(document.documentElement.scrollTop > 170){
	 		header.className = "up-change";
	 	}else{
	 		header.className = "down-change";
	 	}	
	 }
	 
	 //获取文章的函数
	 function getArticle(userId,start,stop){
	 	axios.get(baseURL+'/article/getArticles?userId='+userId+'&start='+start+'&stop='+stop)
	 			.then(function(response){
	 				articles = response.data.articles;
	 				articleLoad(articles);
	 			})
	 			.catch(function(err){
	 				console.log(err);
	 			})
	 }
	 
	 //渲染页面并为赞同按钮绑定单击响应函数
	 function articleLoad(articles){
	 	var num = 0;
	 	var theTitle = document.getElementsByClassName("the-title");
	 	var theIntro = document.getElementsByClassName("the-intro");
	 	var theAgree = document.getElementsByClassName("article-agree");
	 	var theComment = document.getElementsByClassName("article-comment");
	 	var theDisagree = document.getElementsByClassName("article-disagree");
	 	var intro = document.getElementsByClassName("intro");
	 	var readAll = document.getElementsByClassName("article-readAll");
	 	var closeRead = document.getElementsByClassName("close-read");
	 	var articleContainer = document.getElementsByClassName("article-container");
	 	 for(;num<theTitle.length;num++){
	 		 theTitle[num].innerText = articles[num].title;
	 		 theIntro[num].innerText = articles[num].content[0] + articles[num].content[1] + "...";
	 		 if(articles[num].liked){
	 		 	theAgree[num].style.color = "white";
	 		 	theAgree[num].style.backgroundColor = "#0084FF"
	 		 	theAgree[num].innerText = "已赞同" + articles[num].likeNum ;
	 		 }else if(articles[num].disliked){
	 		 	document.getElementsByClassName("article-disagree")[num].style.color = "white";
	 		 	document.getElementsByClassName("article-disagree")[num].style.backgroundColor = "#0084FF";
	 		 }else{
	 		 	theAgree[num].innerText = "赞同" + articles[num].likeNum ;
	 		 }
	 		 theComment[num].innerText = articles[num].commentNum + "评论";
	 		 getAgree(theAgree[num],articles[num],theDisagree[num]);
	 		 getDisagree(theDisagree[num], articles[num],theAgree[num]);
	 		 onreadAll(intro[num],articles[num],articleContainer[num],closeRead[num]);
	 		 closeReadAll(intro[num],articles[num],articleContainer[num],closeRead[num]);
	 	 }
	 	
	 }
	 //点赞和取消点赞
	 function  getAgree(agree, articles,disagree){
	 	agree.onclick = function(){
	 			 axios.post(baseURL+'/article/likeArticle',{
	 				 "userId": loginInfor.userId,
	 				"articleId":articles.articleId,
	 				"like":!articles.liked
	 				})
	 			 			.then(function(response){
	 			 				if(response.status == 200){
	 								if(articles.liked){
	 									//如果原来的liked是ture，则点击后的liked变成false，此时agree按钮变成原来的样式
	 									agree.style="";
	 									articles.liked = false ;
	 									articles.likeNum = parseInt(articles.likeNum)-1 + "";
	 									agree.innerText = "赞同" + parseInt(articles.likeNum) ;
	 								}else if(articles.disliked){
	 									//如果原来的liked是false而且disliked是ture，那么将disagree变成原来的样式，并且将agree变成已赞同的样式
	 									disagree.style = "";
	 									agree.style.color = "white";
	 									agree.style.backgroundColor = "#0084FF";
	 									articles.liked = true;
	 									articles.disliked = false;
	 									articles.likeNum = parseInt(articles.likeNum) + 1 + "";
	 									agree.innerText = "已赞同" +parseInt(articles.likeNum) ;
	 								}else{
	 									//如果agree和disagree都是false，则只改变赞同按钮的样式
	 									agree.style.color = "white";
	 									agree.style.backgroundColor = "#0084FF";
	 									articles.likeNum = parseInt(articles.likeNum) + 1 + "";
	 									agree.innerText = "已赞同" +parseInt(articles.likeNum) ;
	 									articles.liked = true ;
	 								}
	 			 				}else if(response.status == 400){
	 			 					alert("请求方式错误");
	 			 				}else{
	 			 					alert("服务端错误");
	 			 				}
	 			 			})
	 			 			.catch(function(err){
	 			 				console.log(err);
	 			 			})			
	 		}
	 } 
	 
	 //点踩和取消点踩
	 function getDisagree(disagree, articles,agree){
	 	disagree.onclick = function(){
	 			 axios.post(baseURL+'/article/dislikeArticle',{
	 				 "userId": loginInfor.userId,
	 				"articleId":articles.articleId,
	 				"dislike":!articles.disliked
	 				})
	 			 			.then(function(response){
	 			 				if(response.status == 200){
	 								if(articles.disliked){
	 									//如果原来的disliked是ture，则点击后的disliked变成false，此时disagree按钮变成原来的样式
	 									disagree.style="";
	 									articles.disliked = false ;
	 								}else if(articles.liked){
	 									//如果原来的disliked是false而且liked是ture，那么将agree变成原来的样式，并且将disagree变成已踩的样式
	 									disagree.style.color = "white";
	 									disagree.style.backgroundColor = "#0084FF";
	 									articles.disliked = true;
	 									agree.style="";
	 									articles.liked = false ;
	 									articles.likeNum = parseInt(articles.likeNum)-1 + "";
	 									agree.innerText = "赞同" + parseInt(articles.likeNum);
	 								}else{
	 									//如果agree和disagree都是false，则只改变点踩按钮的样式
	 									disagree.style.color = "white";
	 									disagree.style.backgroundColor = "#0084FF";
	 									articles.disliked = true ;
	 								}
	 			 				}else if(response.status == 400){
	 			 					alert("请求方式错误");
	 			 				}else{
	 			 					alert("服务端错误");
	 			 				}
	 			 			})
	 			 			.catch(function(err){
	 			 				console.log(err);
	 			 			})			
	 		}
	 }
	 //阅读全文
	  function onreadAll(intro,articles,articleContainer,closeRead){
	  		intro.onclick = function(){
	  			intro.className += " hidden";
	  			articleContainer.style.display = "flex";
	  			closeRead.style.display = "flex";
	 			if(articleContainer.innerText == ""){
	 				for(var n=0; n<articles.content.length; n++){
	 					articleContainer.innerText += articles.content[n];
	 				}
	 			}
	  		}
	  	}
	  	//收起阅读全文
	  function closeReadAll(intro,articles,articleContainer,closeRead){
	  		closeRead.onclick = function(){
	  			closeRead.style.display = "none";
	  			articleContainer.style.display= "none";
	  			intro.className = "intro";
	  		}
	  	}
	 
	 // 退出登录
	 var logOutBtn = document.getElementById("logOut");
	 function logOut(){
	 axios.post('http://47.97.204.234:3000/user/logout',"username="+username+"&password="+password)
	 				.then(function(response){
	 					if(response.status == 200){
	 						document.getElementsByClassName("logIn-page")[0].style.display = "flex";
	 						document.getElementsByClassName("main-page")[0].className = "main-page hidden";
	 						alert(response.data.message);
	 					}else if(response.status == 400){
	 						alert("请求方式错误");
	 					}else{
	 						alert("服务端错误");
	 					}
	 				})
	 				.catch(function(err){
	 					console.log(err);
	 				})	
	 }
	 logOutBtn.onclick = logOut;
	 // 页面关闭时，自动退出登录；
	document.onunload = logOut;
}	



