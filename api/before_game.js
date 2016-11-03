module.exports = {
    // join room
    JoinRoom: function(io){
        return function(data){
            io.emit('server_to_client', {value : "hoge"});
        }
    },

    // exit room
    ExitRoom: function(data){
        io.emit('server_to_client', {value : "hoge"});
    },
}
