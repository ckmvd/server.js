const http=require('http');
const url=require('url');
const querystring=require('querystring');
const fs=require('fs');

let users={};

    http.createServer((req,res)=>{
    //接收数据
    // console.log(req.method);
    let path='',
    get={},
    post={}
    if(req.method=='GET'){
        let {pathname,query}=url.parse(req.url,true);
        path=pathname;
        get=query;
        complete();
    }else if(req.method=='POST'){
        console.log(req.url);
        path=req.url;
        let arr=[];
        req.on('data',buffer=>{
            arr.push(buffer);
        });
        req.on('end',()=>{
            let buffer=Buffer.concat(arr);
            post=querystring.parse(buffer.toString());
            complete();
        }); 
    }
    function complete(){
        // console.log(path,get,post);
        if(path=='/reg'){
            let {username, password}=get;
            if(users[username]){
                res.write(JSON.stringify({error:1, msg: '此用户名已存在'}));
                res.end();
            }else{
                users[username]=password;//  给上面定义的users对象赋值
                console.log(users);
                res.write(JSON.stringify({error: 0, msg: ''}));
                res.end();
            }
        }else if(path=='/login'){
            let {username,password}=get;
            if(!users[username]){
                res.write(JSON.stringify({error: 1, msg: '找不到此用户'}));
                res.end();
            }else if(users[username]!=password){
                res.write(JSON.stringify({error: 1, msg: '密码不对'}));
                res.end();
            }else{
                res.write(JSON.stringify({error: 0, msg: ''}));
                res.end();
            }
        }else{
            fs.readFile(`www${path}`, (err, buffer)=>{
                if(err){
                  res.writeHeader(404);
                  res.write('Not Found');
                  res.end();
                }else{
                  res.write(buffer);
                  res.end();
                }
            });
        }
    }
}).listen(8080);