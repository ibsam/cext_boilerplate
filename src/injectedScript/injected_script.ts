console.log('<----- Injected script started running ----->');

function parseEssentialDetails() {
    let roster = [];
    localStorage.setItem('PASH_SAVE_LOGS', JSON.stringify(roster))
    
    
    var LOG_PREFIX = new Date().getDate() + '.' + new Date().getMonth() + '.' + new Date().getFullYear() + ' / ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
    var log = console.log;
    console.log = function(){
    
        // 1. Convert args to a normal array
        var args = Array.from(arguments);
        // OR you can use: Array.prototype.slice.call( arguments );
            
        // 2. Prepend log prefix log string
        args.unshift(LOG_PREFIX + ": ");
    
        let message:object = { typeof: "LOG", text: args[1],TimeStamp:Date.now(),URL:location.href};
        let get_log:any = [];
        get_log = localStorage.getItem('PASH_SAVE_LOGS');
    
            if(get_log !== ""){
    
                get_log= JSON.parse(get_log); 
                get_log.push(message); 
                localStorage.setItem('PASH_SAVE_LOGS', JSON.stringify(get_log))
    
            }else{
    
                localStorage.setItem('PASH_SAVE_LOGS', JSON.stringify(get_log))
                
            }
            
        // 3. Pass along arguments to console.log
        log.apply(console, args);
    }
    
    console.log('I did it!')
    
    
    
    // error
    
    var ERROR_PREFIX = new Date().getDate() + '.' + new Date().getMonth() + '.' + new Date().getFullYear() + ' / ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
    var error = console.error;
    console.error = function(){
    
        // 1. Convert args to a normal array
        var args = Array.from(arguments);
        // OR you can use: Array.prototype.slice.call( arguments );
            
        // 2. Prepend error prefix error string
        args.unshift(ERROR_PREFIX + ": ");
    
        let message:object = {  typeof: "ERROR", text: args[1],TimeStamp:Date.now(),URL:location.href};
        let get_error:any =[];
        get_error=localStorage.getItem('PASH_SAVE_LOGS');
    
            if(get_error !== ""){
    
                get_error= JSON.parse(get_error); 
                get_error.push(message); 
                localStorage.setItem('PASH_SAVE_LOGS', JSON.stringify(get_error))
    
            }else{
    
                localStorage.setItem('PASH_SAVE_LOGS', JSON.stringify(get_error))
                
            }
            
        // 3. Pass along arguments to console.log
        error.apply(console, args);
    }
}

window.addEventListener("message", function (event) {
    // only accept messages from the current tab
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type === "PASH_START_CAPTURING") ) {
        // console.log(event);
        parseEssentialDetails();

    }
}, false);