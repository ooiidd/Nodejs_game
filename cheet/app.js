var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs');
    
io.set('close timeout',2000);
io.set('heartbeat timeout',2000);
app.listen(process.env.PORT || 9004);

var gamedata = [];
var interval = [];
var roomcount = 1;

function handler(req, res){
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200);
            data = data.toString('utf-8').replace('<%=host%>', req.headers.host);
            res.end(data);
        }
    );
    if (req.url == "/b1.gif") {
        var img = fs.readFileSync('./b1.gif');
        res.writeHead(200, {'Content-Type': 'image/gif' });
        res.end(img, 'binary');

        return;
        
     }if (req.url == "/wait.gif") {
         var img = fs.readFileSync('./wait.gif');
         res.writeHead(200, {'Content-Type': 'image/gif' });
         res.end(img, 'binary');

         return;
      }
    if (req.url == "/004.gif") {
         var img = fs.readFileSync('./004.gif');
         res.writeHead(200, {'Content-Type': 'image/gif' });
         res.end(img, 'binary');

         return;
      }
};
//time set
function time_set(i,sockid){
   if(gamedata[i].state=='start'){
      if(parseInt(gamedata[i].timer)<1){//턴 교체
         click_event(i,9,gamedata[i].turn,sockid);
//         console.log('if')
      }else{
         var t = gamedata[i].timer - 1 ;
         gamedata[i].timer = t;
//         console.log('else')
      }
      
   }
   io.sockets.in(socketRoom[sockid]).emit('timer_set',gamedata[i]);
   //뭐지;;
//   var k = gamedata[i].timer + 2;
//   gamedata[i].timer = k;
//   console.log(t);
}
function search_gamedata_index(array, room) {
   var i=0
   for(i=0; i<gamedata.length; i++) {
      if(gamedata[i].roomname == room) {
         return i;
      }
   }
   return -1;
}
//클릭시 이벤트 처리  -> 자기가 가지고 있는데이터 주위 탐방
function click_event(i,color,p_check,sockid){
   console.log(i + ' ' + color + ' '+ p_check + ' '+ sockid);
   var color_num;
   if(color=='red'){
      color_num=0;
   }else if(color =='blue'){
      color_num=2;
   }else if(color == 'green'){
      color_num=1;
   }else if(color == 'green_blue'){
      color_num=3;
   }
   console.log('color_num = '+color_num);
   //player1 의 입력일시
   if(gamedata[i].turn == 1){
      if(gamedata[i].turn==p_check){
         console.log(gamedata[i].gamer1_col.length);
         for(var q=0;q<gamedata[i].gamer1_col.length;q++){
            var row = gamedata[i].gamer1_row[q];
            var   col = gamedata[i].gamer1_col[q];
            console.log('row : '+row+'col : '+col);
            if(gamedata[i].dataArray[row][col-1]==color_num){
               gamedata[i].dataArray[row][col-1]=11;
               gamedata[i].gamer1_row.push(row);
               gamedata[i].gamer1_col.push(col-1);
            }
            if(gamedata[i].dataArray[row][col+1]==color_num){
               gamedata[i].dataArray[row][col+1]=11;
               gamedata[i].gamer1_row.push(row);
               gamedata[i].gamer1_col.push(col+1);
            }
            if(gamedata[i].dataArray[row+1][col]==color_num){
               gamedata[i].dataArray[row+1][col]=11;
               gamedata[i].gamer1_row.push(row+1);
               gamedata[i].gamer1_col.push(col);
            }
            if(gamedata[i].dataArray[row-1][col]==color_num){
               gamedata[i].dataArray[row-1][col]=11;
               gamedata[i].gamer1_row.push(row-1);
               gamedata[i].gamer1_col.push(col);
            }
//            if((gamedata[i].dataArray[row-1][col]==11 || gamedata[i].dataArray[row-1][col]==-1) && 
//                  (gamedata[i].dataArray[row+1][col]==11|| gamedata[i].dataArray[row-1][col]==-1) &&
//                  (gamedata[i].dataArray[row][col-1]==11|| gamedata[i].dataArray[row-1][col]==-1) &&
//                  (gamedata[i].dataArray[row][col+1]==11|| gamedata[i].dataArray[row-1][col]==-1)){
//               gamedata[i].gamer1_row.splice(q,1);
//               gamedata[i].gamer1_col.splice(q,1);
//            }
         }
         for(var k=0;k<12;k++){
            console.log(gamedata[i].dataArray[k][0]+' '+gamedata[i].dataArray[k][1]+' '+
                  gamedata[i].dataArray[k][2]+' '+gamedata[i].dataArray[k][3]+' '+
                  gamedata[i].dataArray[k][4]+' '+gamedata[i].dataArray[k][5]+' '+
                  gamedata[i].dataArray[k][6]+' '+gamedata[i].dataArray[k][7]+' '+
                  gamedata[i].dataArray[k][8]+' '+gamedata[i].dataArray[k][9]+' '+
                  gamedata[i].dataArray[k][10]+' '+gamedata[i].dataArray[k][11]+' ');
         }
         var temp=true;
         for(var k=0;k<gamedata[i].gamer2_row.length;k++){
            //둘곳 아직 있음 -> true로 놔두고 ㄱㄱ

            var row = gamedata[i].gamer2_row[k];
            var   col = gamedata[i].gamer2_col[k];
            if((gamedata[i].dataArray[row][col-1]==0) || (gamedata[i].dataArray[row][col-1]==1) ||
                  (gamedata[i].dataArray[row][col-1]==2) || (gamedata[i].dataArray[row][col-1]==3)||
                  
                  (gamedata[i].dataArray[row][col+1]==0) || (gamedata[i].dataArray[row][col+1]==1) ||
                  (gamedata[i].dataArray[row][col+1]==2) || (gamedata[i].dataArray[row][col+1]==3)||
                  
                  (gamedata[i].dataArray[row-1][col]==0) || (gamedata[i].dataArray[row-1][col]==1) ||
                  (gamedata[i].dataArray[row-1][col]==2) || (gamedata[i].dataArray[row-1][col]==3)||
                  
                  (gamedata[i].dataArray[row+1][col]==0) || (gamedata[i].dataArray[row+1][col]==1) ||
                  (gamedata[i].dataArray[row+1][col]==2) || (gamedata[i].dataArray[row+1][col]==3)){
               temp=false;
               break;
            }
         }
         if(temp==false){

            gamedata[i].turn=2;
            gamedata[i].turn_nick=gamedata[i].gamer2;
         }
         else{
            console.log('p1 : 상대편이 둘곳 없음.');
            gamedata[i].turn=1;
            gamedata[i].turn_nick=gamedata[i].gamer1;
         }
         //emit 으로 알려줘야함 turn도 바꿔줘야함
         io.sockets.in(socketRoom[sockid]).emit('gamedata_ToClient', gamedata[i]);
         console.log('gamedata submit to client' + ' socketRoom : ' +socketRoom[sockid]);
      }
      else{
         //예외처리 턴 아닌데 누름
      }
      //player2의 입력일시
   }else{
      console.log('player2 else');
      if(gamedata[i].turn==p_check){
         console.log('player2 if');
         console.log(gamedata[i].gamer2_col.length);
         for(var q=0;q<gamedata[i].gamer2_col.length;q++){
            var row = gamedata[i].gamer2_row[q],
               col = gamedata[i].gamer2_col[q];

            console.log('row2 : '+row+'  col2 : '+col);
            if(gamedata[i].dataArray[row][col-1]==color_num){
               gamedata[i].dataArray[row][col-1]=12;
               gamedata[i].gamer2_row.push(row);
               gamedata[i].gamer2_col.push(col-1);
            }
            if(gamedata[i].dataArray[row][col+1]==color_num){
               gamedata[i].dataArray[row][col+1]=12;
               gamedata[i].gamer2_row.push(row);
               gamedata[i].gamer2_col.push(col+1);
            }
            if(gamedata[i].dataArray[row+1][col]==color_num){
               gamedata[i].dataArray[row+1][col]=12;
               gamedata[i].gamer2_row.push(row+1);
               gamedata[i].gamer2_col.push(col);
            }
            if(gamedata[i].dataArray[row-1][col]==color_num){
               gamedata[i].dataArray[row-1][col]=12;
               gamedata[i].gamer2_row.push(row-1);
               gamedata[i].gamer2_col.push(col);
            }
//            if((gamedata[i].dataArray[row-1][col]==12 || gamedata[i].dataArray[row-1][col]==-1) && 
//                  (gamedata[i].dataArray[row+1][col]==12|| gamedata[i].dataArray[row-1][col]==-1) &&
//                  (gamedata[i].dataArray[row][col-1]==12|| gamedata[i].dataArray[row-1][col]==-1) &&
//                  (gamedata[i].dataArray[row][col+1]==12|| gamedata[i].dataArray[row-1][col]==-1)){
//               gamedata[i].gamer2_row.splice(q,1);
//               gamedata[i].gamer2_col.splice(q,1);
//            }
         }
         //emit 으로 알려줘야함 turn도 바꿔줘야함
         for(var k=0;k<12;k++){
            console.log(gamedata[i].dataArray[k][0]+' '+gamedata[i].dataArray[k][1]+' '+
                  gamedata[i].dataArray[k][2]+' '+gamedata[i].dataArray[k][3]+' '+
                  gamedata[i].dataArray[k][4]+' '+gamedata[i].dataArray[k][5]+' '+
                  gamedata[i].dataArray[k][6]+' '+gamedata[i].dataArray[k][7]+' '+
                  gamedata[i].dataArray[k][8]+' '+gamedata[i].dataArray[k][9]+' '+
                  gamedata[i].dataArray[k][10]+' '+gamedata[i].dataArray[k][11]+' ');
         }
         var temp=true;
         for(var k=0;k<gamedata[i].gamer1_row.length;k++){
            //둘곳 아직 있음 -> true로 놔두고 ㄱㄱ

            var row = gamedata[i].gamer1_row[k];
            var   col = gamedata[i].gamer1_col[k];
            if((gamedata[i].dataArray[row][col-1]==0) || (gamedata[i].dataArray[row][col-1]==1) ||
                  (gamedata[i].dataArray[row][col-1]==2) || (gamedata[i].dataArray[row][col-1]==3)||
                  
                  (gamedata[i].dataArray[row][col+1]==0) || (gamedata[i].dataArray[row][col+1]==1) ||
                  (gamedata[i].dataArray[row][col+1]==2) || (gamedata[i].dataArray[row][col+1]==3)||
                  
                  (gamedata[i].dataArray[row-1][col]==0) || (gamedata[i].dataArray[row-1][col]==1) ||
                  (gamedata[i].dataArray[row-1][col]==2) || (gamedata[i].dataArray[row-1][col]==3)||
                  
                  (gamedata[i].dataArray[row+1][col]==0) || (gamedata[i].dataArray[row+1][col]==1) ||
                  (gamedata[i].dataArray[row+1][col]==2) || (gamedata[i].dataArray[row+1][col]==3)){
               temp=false;
               break;
            }
         }
         if(temp==false){

            gamedata[i].turn=1;
            gamedata[i].turn_nick=gamedata[i].gamer1;
         }
         else{
            console.log('p2 : 상대편이 둘곳 없음.');
            gamedata[i].turn=2;
            gamedata[i].turn_nick=gamedata[i].gamer2;
         }
         io.sockets.in(socketRoom[sockid]).emit('gamedata_ToClient', gamedata[i]);
         console.log('gamedata submit to client'+ 'socketRoom : ' +socketRoom[sockid]);
      }
      else{
         //예외처리 턴 아닌데 누름
      }
   }
   //종료 판단
   var end_check=true;
   for(var k=1;k<11;k++){
      for(var j=1;j<11;j++){
         if(gamedata[i].dataArray[k][j]==11 || gamedata[i].dataArray[k][j]==12){
            continue;
         }
         else{
            end_check=false;
            break;
         }
      }
   }
   if(end_check==true){
      //게임이 끝남을 알려줘야함.
      console.log('게임 끝');
      //0603
      io.sockets.in(socketRoom[sockid]).emit('game_end',gamedata[i]);
   }
   else{
      //둘곳 있는지 없는지 체크해줘야함.
   }
   gamedata[i].timer=5;
}

// socket.io 셋팅
io.configure(function(){
    io.set('transports', ['xhr-polling']);
    io.set('polling duration', 10);
    io.set('log level', 2);
});

var socketRoom = {};

io.sockets.on('connection', function(socket){
    // 접속완료를 알림.
    socket.emit('connected');
    socket.heartbeatTimeout = 20000;
    // chat요청을 할 시
    socket.on('requestRandomChat', function(data){
        // 빈방이 있는지 확인
        console.log('requestRandomChat');
        var rooms = io.sockets.manager.rooms;
        for (var key in rooms){
            if (key == ''){
                continue;
            }
            // 혼자있으면 입장
            if (rooms[key].length == 1){
                var roomKey = key.replace('/', '');
                console.log(key);
                console.log(roomKey);
                socket.join(roomKey);
                socket.set('nickname',data.nickname);
                
                var i = search_gamedata_index(gamedata,roomKey);
                console.log(i);
                gamedata[i].gamer2 = data.nickname;
                for(var j=1;j<11;j++)
                   for(var t=1;t<11;t++){
                      gamedata[i].dataArray[j][t]=parseInt(Math.random()*4);
                   }
                for(var j=0;j<12;j++){
                   gamedata[i].dataArray[j][0]=-1;
                }
                for(var j=0;j<12;j++){
                   gamedata[i].dataArray[j][11]=-1;
                }
                for(var j=0;j<12;j++){
                   gamedata[i].dataArray[0][j]=-1;
                }
                for(var j=0;j<12;j++){
                   gamedata[i].dataArray[11][j]=-1;
                }
                
                gamedata[i].dataArray[1][1]=11;
                gamedata[i].dataArray[10][10]=12;
                
                
                
                console.log('col1 length : '+gamedata[i].gamer1_col.length);
                gamedata[i].gamer1_col.push(1);
                console.log(gamedata[i].gamer1_col[0]);

                console.log(' push -> col1 length : '+gamedata[i].gamer1_col.length);
                gamedata[i].gamer1_row.push(1);
                gamedata[i].gamer2_col.push(10);
                gamedata[i].gamer2_row.push(10);
                interval[i]=setInterval(function(){
                   //function 넣어야함.
                   time_set(i,socket.id);
//                   console.log("interval 1초 하이  room : " + gamedata[i].roomname);
                },1000);

                io.sockets.in(roomKey).emit('completeMatch', gamedata[i]);
                socketRoom[socket.id] = roomKey;
                
                return;
            }
        }
        // 빈방이 없으면 혼자 방만들고 기다림.
//        socket.join(socket.id);
        console.log(roomcount + "생성");
        socket.join(roomcount++);
        socket.set('nickname',data.nickname);
        socketRoom[socket.id] = roomcount-1;
        //game room 이 없다면 생성해줌.
        if(search_gamedata_index(gamedata,roomcount-1) == -1 ){
           gamedata.push(
                 {
                    'roomname' : roomcount-1,
                    'dataArray' : new Array(
                          new Array(),
                          new Array(),
                          new Array(),
                          new Array(),
                          new Array(),
                          new Array(),
                          new Array(),
                          new Array(),
                          new Array(),
                          new Array(),
                          new Array(),
                          new Array()
                    ),
                    'gamer1' : data.nickname,
                    'gamer2' : '',
                    'gamer1_check' : true,
                    'gamer2_check' : true,
                    'gamer1_ready' : 'no',
                    'gamer2_ready' : 'no',
                    'users' : [],
                    'state' : 'no',
                    'turn' : 1,
                    'turn_nick' : data.nickname,
                    'gamer1_col' : [],
                    'gamer1_row' : [],
                    'gamer2_row' : [],
                    'gamer2_col' : [],
                    'timer' : 5
                 });
        }
    });
    //button 클릭 처리
    socket.on('button_click',function(data){
       console.log('button_click');
       var i = search_gamedata_index(gamedata,socketRoom[socket.id]);
       click_event(i,data.color,data.p_check,socket.id);
    });
    // 요청 취소 시
    socket.on('cancelRequest', function(data){
        socket.leave(socketRoom[socket.id]);
    });
    
    // client -> server Message전송 시
    socket.on('sendMessage', function(data){
       socket.get('nickname',function(err,name){
          console.log('sendMessage!' + "room : " + socketRoom[socket.id]);
           io.sockets.in(socketRoom[socket.id]).emit('receiveMessage', {'data':data
              ,'from':name});
           console.log(socketRoom[socket.id]);
       });
    });
    socket.on('ready_click', function(data){
       var a = search_gamedata_index(gamedata,socketRoom[socket.id]);
       if(data==1){
          if(gamedata[a].gamer1_ready=='no')
             gamedata[a].gamer1_ready='ready';
          else{
             gamedata[a].gamer1_ready='no';
          }
       }else{
          if(gamedata[a].gamer2_ready=='no')
             gamedata[a].gamer2_ready='ready';
          else{
             gamedata[a].gamer2_ready='no';
          }
       }
       console.log("레디 버튼 눌림");
       if((gamedata[a].gamer2_ready=='ready') && (gamedata[a].gamer1_ready=='ready')){
          gamedata[a].state='start';
       }
       io.sockets.in(socketRoom[socket.id]).emit('ready_state',gamedata[a]);
    });
    
    // disconnect
    socket.on('disconnect2', function(data){
       console.log('제발 disconnect');
        var key = socketRoom[socket.id];
        socket.leave(key);
        io.sockets.in(key).emit('disconnect');
        var clients = io.sockets.clients(key);
        for (var i = 0; i < clients.length; i++){
            clients[i].leave(key);
        }
        var a = search_gamedata_index(gamedata,socketRoom[socket.id]);

        clearInterval(interval[a]);
        gamedata.splice(a , 1);
    });
    socket.on('disconnect', function(data){
       soncole.log('제발 disconnect');
        var key = socketRoom[socket.id];
        socket.leave(key);
        io.sockets.in(key).emit('disconnect');
        var clients = io.sockets.clients(key);
        for (var i = 0; i < clients.length; i++){
            clients[i].leave(key);
        }
        var a = search_gamedata_index(gamedata,socketRoom[socket.id]);

        clearInterval(interval[a]);
        gamedata.splice(a , 1);
    });
});