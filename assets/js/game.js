
////////////////
var position = [0,0]
for (var y = 0;y<10;y++){
    for (var x = 0;x<10;x++){
        position = [x,y]
        document.body.innerHTML += '<button style = "position:fixed; left:'+(110+x*40)+'px; top:'+(110+y*40)+'px;border:none;padding: 18px 18px; background-color:transparent;"onclick="place_ship_at_position(['+position+'])" ></button>' 
    }
}   
var position = [0,0]
for (var y = 0;y<10;y++){
    for (var x = 0;x<10;x++){
        position = [x,y]
        document.body.innerHTML += '<button style = "position:fixed; left:'+(715+x*40)+'px; top:'+(115+y*40)+'px;padding: 13px 13px;border:none; background-color:transparent;"onclick="shot(['+position+'],'+'game_have_started'+')" ></button>' 
    }
}

var canvas = document.getElementById("gameScreen")
var ctx = canvas.getContext("2d");
ctx.fillStyle = '#51A9FF'//changing color of ctx fill rectangle
ctx.strokeStyle = "white";//changing color of ctx frame
ctx.fillRect(100,100,400,400)
ctx.fillRect(700,100,400,400)
///////////////////
var text = document.getElementById("text");

// alert("Welcome. Place your ships by clicking on the left field");
text.innerHTML="Welcome. Place your ships by clicking on the left field";
var all_boards = ships()
var computer_grid = put_ships()
show_grid(computer_grid,ctx,true)


var horizontal_position = true
var current_ship_index = 0
var current_ship = all_boards[current_ship_index]
var temporary_player_grid = create_grid()
var confirmed_grid = create_grid()
var current_ship_placed = false
let game_have_started = false 
show_grid(confirmed_grid,ctx)
let computer_destroyed_cells = 0

//computer shooting variables
let computer_found_new_ship = false
let computer_found_new_direction = false
let shooting_direction 
let shooting_directions = []
let current_aim_cell = []
let next_shot_another_direction_x_y=[]
let next_shot_x_y = []
let x2
let y2
let already_shot = false
let previous_written_position2 = [x2,y2]
let shot_time = 500
let shot_time2 = 500
let players_destroyed_cells = 0


function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
    }
function start_game(){
    game_have_started = true
    // alert("Now start shooting at the right field!");
    text.innerHTML="Now start shooting at the right field!";
}

function shot(position_x_y_,game_have_started_){

    if (game_have_started_){
        let x = position_x_y_[0]
        let y = position_x_y_[1]
        if (computer_grid[y][x] === "O"){
            computer_grid[y][x] = "x"
            computer_destroyed_cells++
        } else {
            computer_grid[y][x] = "m"
            computer_shot()
        }
        show_grid(computer_grid,ctx,true)
        if (computer_destroyed_cells > 19){
            // alert("Victory!!! All enemy ships have been destroyed!");
            text.innerHTML="Victory!!! All enemy ships have been destroyed!";
        }
    }

}

async function computer_shot(){
    if (players_destroyed_cells > 19){
        // alert("Defeat. All our ships have been destroyed!");
        text.innerHTML="Defeat. All our ships have been destroyed!";
    }
    show_grid(confirmed_grid,ctx)
    if (computer_found_new_direction){
        await delay(shot_time2);
        if (shooting_direction == 1){
            if (computer_found_last_direction){
                if (confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] === "m" || confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] === "f"){
                    already_shot = true
                }
                while (confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] === "O"){
                    confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] = "x"
                    current_aim_cell.push([next_shot_another_direction_x_y[0],next_shot_another_direction_x_y[1]])
                    show_grid(confirmed_grid,ctx)
                    await delay(shot_time);
                    next_shot_another_direction_x_y[1]--
                    if (next_shot_another_direction_x_y[1]===-1){
                        break;
                    }
                }
                if (next_shot_another_direction_x_y[1]!==-1  || confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] === "f"){
                    confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] = "m"
                    await delay(shot_time);
                }
                previous_written_position2 = [y2,x2]
                for (place of current_aim_cell){
                    grid = ban_place(confirmed_grid,place[1],place[0],previous_written_position2,"f")
                    confirmed_grid = make_full_copy_of_grid(grid)
                    previous_written_position2 = [place[1],place[0]]
                }
                for (place of current_aim_cell){
                    confirmed_grid[place[1]][place[0]] = "x"
                    players_destroyed_cells++
                }
                show_grid(confirmed_grid,ctx)
                computer_found_last_direction = false
                computer_found_new_direction = false
                computer_found_new_ship = false
                if (next_shot_another_direction_x_y[1]===-1 || already_shot){
                    already_shot = false
                    computer_shot()
                }

            }else{
                
                while (confirmed_grid[next_shot_x_y[1]][next_shot_x_y[0]] === "O"){
                    confirmed_grid[next_shot_x_y[1]][next_shot_x_y[0]] = "x"
                    current_aim_cell.push([next_shot_x_y[0],next_shot_x_y[1]])
                    show_grid(confirmed_grid,ctx)
                    await delay(shot_time);
                    if (next_shot_x_y[1]===9){
                        computer_found_last_direction = true
                        computer_shot()
                        break;
                    }
                    next_shot_x_y[1]++
                }
                if (confirmed_grid[next_shot_x_y[1]][next_shot_x_y[0]] === "m" || confirmed_grid[next_shot_x_y[1]][next_shot_x_y[0]] === "f"){
                    computer_found_last_direction = true
                    computer_shot()
                    return
                }
                    confirmed_grid[next_shot_x_y[1]][next_shot_x_y[0]] = "m"
                    show_grid(confirmed_grid,ctx)
                    computer_found_last_direction = true
                }
        }else if (shooting_direction == 2){
            if (computer_found_last_direction){
                if (confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] === "m" || confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] === "f"){
                    already_shot = true
                }
                while (confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] === "O"){
                    confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] = "x"
                    current_aim_cell.push([next_shot_another_direction_x_y[0],next_shot_another_direction_x_y[1]])
                    show_grid(confirmed_grid,ctx)
                    await delay(shot_time);
                    next_shot_another_direction_x_y[0]--
                    if (next_shot_another_direction_x_y[0]===-1){
                        break;
                    }
                }
                if (next_shot_another_direction_x_y[0]!==-1 || confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] === "f"){
                confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] = "m"
                await delay(shot_time);
                }   
                previous_written_position2 = [y2,x2]
                for (place of current_aim_cell){
                    grid = ban_place(confirmed_grid,place[1],place[0],previous_written_position2,"f")
                    confirmed_grid = make_full_copy_of_grid(grid)
                    previous_written_position2 = [place[1],place[0]]
                }
                for (place of current_aim_cell){
                    confirmed_grid[place[1]][place[0]] = "x"
                    players_destroyed_cells++
                }
                show_grid(confirmed_grid,ctx)
                computer_found_last_direction = false
                computer_found_new_direction = false
                computer_found_new_ship = false
                if (next_shot_another_direction_x_y[0]===-1 || already_shot){
                    already_shot = false
                    computer_shot()
                }
            }else{
                
                while (confirmed_grid[next_shot_x_y[1]][next_shot_x_y[0]] === "O"){
                    confirmed_grid[next_shot_x_y[1]][next_shot_x_y[0]] = "x"
                    current_aim_cell.push([next_shot_x_y[0],next_shot_x_y[1]])
                    show_grid(confirmed_grid,ctx)
                    await delay(shot_time);
                    if (next_shot_x_y[0]===9){
                        computer_found_last_direction = true
                        computer_shot()
                        break;
                    }
                    next_shot_x_y[0]++
                }
                if (confirmed_grid[next_shot_x_y[1]][next_shot_x_y[0]] === "m" || confirmed_grid[next_shot_x_y[1]][next_shot_x_y[0]] === "f"){
                    computer_found_last_direction = true
                    computer_shot()
                    return
                }
                    confirmed_grid[next_shot_x_y[1]][next_shot_x_y[0]] = "m"
                    show_grid(confirmed_grid,ctx)
                    computer_found_last_direction = true
                }
        }else if (shooting_direction == 3){
            if (computer_found_last_direction){
                if (confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] === "m" || confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] === "f"){
                    already_shot = true
                }
                while (confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] === "O"){
                    confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] = "x"
                    current_aim_cell.push([next_shot_another_direction_x_y[0],next_shot_another_direction_x_y[1]])
                    show_grid(confirmed_grid,ctx)
                    await delay(shot_time);
                    next_shot_another_direction_x_y[1]++
                    if (next_shot_another_direction_x_y[1]===10){
                        break;
                    }
                }
                if (next_shot_another_direction_x_y[1]!==10  || confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] === "f"){
                confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] = "m"
                await delay(shot_time);
                }  
                previous_written_position2 = [y2,x2]
                for (place of current_aim_cell){
                    
                    grid = ban_place(confirmed_grid,place[1],place[0],previous_written_position2,"f")
                    confirmed_grid = make_full_copy_of_grid(grid)
                    previous_written_position2 = [place[1],place[0]]
                }
                for (place of current_aim_cell){
                    confirmed_grid[place[1]][place[0]] = "x"
                    players_destroyed_cells++
                }
                show_grid(confirmed_grid,ctx)
                computer_found_last_direction = false
                computer_found_new_direction = false
                computer_found_new_ship = false
                if (next_shot_another_direction_x_y[1]===10 || already_shot){
                    already_shot = false
                    computer_shot()
                }
            }else{
                
                while (confirmed_grid[next_shot_x_y[1]][next_shot_x_y[0]] === "O"){
                    confirmed_grid[next_shot_x_y[1]][next_shot_x_y[0]] = "x"
                    current_aim_cell.push([next_shot_x_y[0],next_shot_x_y[1]])
                    show_grid(confirmed_grid,ctx)
                    await delay(shot_time);
                    if (next_shot_x_y[1]===0){
                        computer_found_last_direction = true
                        computer_shot()
                        break;
                    }
                    next_shot_x_y[1]--
                }
                if (confirmed_grid[next_shot_x_y[1]][next_shot_x_y[0]] === "m" || confirmed_grid[next_shot_x_y[1]][next_shot_x_y[0]] === "f"){
                    computer_found_last_direction = true
                    computer_shot()
                    return
                }
                    confirmed_grid[next_shot_x_y[1]][next_shot_x_y[0]] = "m"
                    show_grid(confirmed_grid,ctx)
                    computer_found_last_direction = true
                }
        }else if (shooting_direction == 4){
            if (computer_found_last_direction){
                if (confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] === "m" || confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] === "f"){
                    already_shot = true
                }
                while (confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] === "O"){
                    confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] = "x"
                    current_aim_cell.push([next_shot_another_direction_x_y[0],next_shot_another_direction_x_y[1]])
                    await delay(shot_time);
                    show_grid(confirmed_grid,ctx)
                    next_shot_another_direction_x_y[0]++
                    if (next_shot_another_direction_x_y[0]===10){
                        break;
                    }
                }
                if (next_shot_another_direction_x_y[0]!==10  || confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] === "f"){
                    confirmed_grid[next_shot_another_direction_x_y[1]][next_shot_another_direction_x_y[0]] = "m"
                    await delay(shot_time);
                }  
                  previous_written_position2 = [y2,x2]
                for (place of current_aim_cell){
                    grid = ban_place(confirmed_grid,place[1],place[0],previous_written_position2,"f")
                    confirmed_grid = make_full_copy_of_grid(grid)
                    previous_written_position2 = [place[1],place[0]]
                }
                for (place of current_aim_cell){
                    confirmed_grid[place[1]][place[0]] = "x"
                    players_destroyed_cells++
                }
                show_grid(confirmed_grid,ctx)
                computer_found_last_direction = false
                computer_found_new_direction = false
                computer_found_new_ship = false
                if (next_shot_another_direction_x_y[0]===10 || already_shot){
                    already_shot = false
                    computer_shot()
                }
            }else{
                
                while (confirmed_grid[next_shot_x_y[1]][next_shot_x_y[0]] === "O"){
                    confirmed_grid[next_shot_x_y[1]][next_shot_x_y[0]] = "x"
                    current_aim_cell.push([next_shot_x_y[0],next_shot_x_y[1]])
                    show_grid(confirmed_grid,ctx)
                    await delay(shot_time);
                    if (next_shot_x_y[0]===0){
                        computer_found_last_direction = true
                        computer_shot()
                        break;
                    }
                    next_shot_x_y[0]--
                }
                if (confirmed_grid[next_shot_x_y[1]][next_shot_x_y[0]] === "m" || confirmed_grid[next_shot_x_y[1]][next_shot_x_y[0]] === "f"){
                    computer_found_last_direction = true
                    computer_shot()
                    return
                }
                    confirmed_grid[next_shot_x_y[1]][next_shot_x_y[0]] = "m"
                    show_grid(confirmed_grid,ctx)
                    computer_found_last_direction = true
                }
        }
    }else if(!computer_found_new_ship){
        await delay(shot_time2);
        x2 = getRandomInt(0,9)
        y2 = getRandomInt(0,9)
        if ((confirmed_grid[y2][x2] === "m") || (confirmed_grid[y2][x2] === "x") || (confirmed_grid[y2][x2] === "f"))
        {
            shot_time2 = 0
            computer_shot()
            shot_time2 = 500
            return
        }
        if (confirmed_grid[y2][x2] === "O"){
            confirmed_grid[y2][x2] = "x"
            
            current_aim_cell = []
            current_aim_cell.push([x2,y2])
            computer_found_new_ship = true
            while (shooting_directions.length < 4){
                let direction = getRandomInt(1,4)
                if(shooting_directions.indexOf(direction) === -1) shooting_directions.push(direction);
            }
            show_grid(confirmed_grid,ctx)
            
            computer_shot()
        } else {
            confirmed_grid[y2][x2] = "m"
            show_grid(confirmed_grid,ctx)
        }
    } else{
        await delay(shot_time);
        if (shooting_directions.length === 0){
            players_destroyed_cells++
            previous_written_position2 = [y2,x2]
            grid = ban_place(confirmed_grid,y2,x2,previous_written_position2,"f")
            confirmed_grid = make_full_copy_of_grid(grid)
            computer_found_new_ship = false
            show_grid(confirmed_grid,ctx)
            computer_shot()
            return
        }
        
        computer_found_last_direction = false
        if (x2 ===0){
            let index = shooting_directions.indexOf(4);
            if (index !== -1) {
                shooting_directions.splice(index, 1);
            }
        }
        if (x2 ===9){
            let index = shooting_directions.indexOf(2);
            if (index !== -1) {
                shooting_directions.splice(index, 1);
            }
        }
        if (y2 ===0){
            let index = shooting_directions.indexOf(3);
            if (index !== -1) {
                shooting_directions.splice(index, 1);
            }
        }
        if (y2 ===9){
            let index = shooting_directions.indexOf(1);
            if (index !== -1) {
                shooting_directions.splice(index, 1);
            }
        }
        shooting_direction = shooting_directions[shooting_directions.length-1]
        if(shooting_direction === 1){
            if (confirmed_grid[y2+1][x2] === "O"){
                confirmed_grid[y2+1][x2] = "x"
                current_aim_cell.push([x2,y2+1])
                next_shot_another_direction_x_y = [x2,y2-1]
                next_shot_x_y = [x2,y2+2]
                computer_found_new_direction = true
                if ((y2+1)===9){
                    computer_found_last_direction = true
                }
                computer_shot()
            } else{
                shooting_directions.pop()
                if(confirmed_grid[y2+1][x2] === "m" || confirmed_grid[y2+1][x2] === "f")
                {
                    computer_shot()
                    
                }else{
                    confirmed_grid[y2+1][x2] = "m"
                    show_grid(confirmed_grid,ctx)
                }
            }
        }else if(shooting_direction === 2){
            if (confirmed_grid[y2][x2+1] === "O"){
                confirmed_grid[y2][x2+1] = "x"
                current_aim_cell.push([x2+1,y2])
                next_shot_another_direction_x_y = [x2-1,y2]
                next_shot_x_y = [x2+2,y2]
                computer_found_new_direction = true
                if ((x2+1)===9){
                    computer_found_last_direction = true
                }
                computer_shot()
            } else{
                shooting_directions.pop()
                if(confirmed_grid[y2][x2+1] === "m" || confirmed_grid[y2][x2+1] === "f")
                {
                    computer_shot()
                    
                }else{
                    confirmed_grid[y2][x2+1] = "m"
                    show_grid(confirmed_grid,ctx)
                }
            }

        }else if(shooting_direction === 3){
            if (confirmed_grid[y2-1][x2] === "O"){
                confirmed_grid[y2-1][x2] = "x"
                current_aim_cell.push([x2,y2-1])
                next_shot_another_direction_x_y = [x2,y2+1]
                next_shot_x_y = [x2,y2-2]
                computer_found_new_direction = true
                if ((y2-1)===0){
                    computer_found_last_direction = true
                }
                computer_shot()
            } else{
                shooting_directions.pop()
                if(confirmed_grid[y2-1][x2] === "m" || confirmed_grid[y2-1][x2] === "f")
                {
                    computer_shot()
                    
                }else{
                    confirmed_grid[y2-1][x2] = "m"
                    show_grid(confirmed_grid,ctx)
                }
            }
        }else {
            if (confirmed_grid[y2][x2-1] === "O"){
                confirmed_grid[y2][x2-1] = "x"
                current_aim_cell.push([x2-1,y2])
                next_shot_another_direction_x_y = [x2+1,y2]
                next_shot_x_y = [x2-2,y2]
                computer_found_new_direction = true
                if ((x2-1)===0){
                    computer_found_last_direction = true
                }
                computer_shot()
            } else{
                shooting_directions.pop()
                if(confirmed_grid[y2][x2-1] === "m" || confirmed_grid[y2][x2-1] === "f")
                {
                    computer_shot()
                    
                }else{
                    confirmed_grid[y2][x2-1] = "m"
                    show_grid(confirmed_grid,ctx)
                }
            }
        }
    }
    if (players_destroyed_cells > 19){
        // alert("Defeat. All our ships have been destroyed!");
        text.innerHTML="Defeat. All our ships have been destroyed!";
    }
}

function make_full_copy_of_grid(original){
    var copy=create_grid()
    for (var y = 0;y<10;y++){
        for (var x=0;x<10;x++){
            copy[y][x] = original[y][x]
        }
    }
    return copy
}

function create_grid() {
    var H = []
    for (var i = 0;i<10;i++){
        H.push("----------".split(''))
    }
    return H
}
function put_ships() {
    var All_boards = all_boards
    var grid = create_grid()
    var count_unsuccessful_placing
    var horizontal_position_
    var grid_position
    for (var ship of All_boards) {
        horizontal_position_ = Math.random() < 0.5;
        grid_position = [getRandomInt(0,9),getRandomInt(0,9)]//[x,y]
        count_unsuccessful_placing = 0
        while(true){
            var answer = place_computer_ship_at_position(ship,grid_position,horizontal_position_,grid)
            if (count_unsuccessful_placing == 100){
                return put_ships(create_grid(),true)
            }
            if (answer[0]){
                grid = answer[1]
                break
            }else{
                grid_position = [getRandomInt(0,9),getRandomInt(0,9)]
                count_unsuccessful_placing++
            }
        
        }
    }
    return grid
}
function put_player_ship(){
    if(current_ship_placed){
        confirmed_grid = make_full_copy_of_grid(temporary_player_grid)
        current_ship_index++
        current_ship = all_boards[current_ship_index]
        show_current_ship()
        rotate()
        current_ship_placed = false
        if (current_ship_index===10){
            start_game()
        }
    }
}
function ships() {
    var All_boards =[]
    All_boards.push(4)
    All_boards.push(3)
    All_boards.push(3)
    All_boards.push(2)
    All_boards.push(2)
    All_boards.push(2)
    All_boards.push(1)
    All_boards.push(1)
    All_boards.push(1)
    All_boards.push(1)
    return All_boards
}
function place_ship_at_position(position_x_y){
    var grid = make_full_copy_of_grid(confirmed_grid)
    var x = position_x_y[0]
    var y = position_x_y[1]
    var previous_written_position =[20,20]
    if (horizontal_position){
        if(x>(10-current_ship)){
            return false
        } 
        for (var i=0;i < current_ship;i++){
            if(grid[y][x+i] === "O" || grid[y][x+i] === "o"){
                return false
            }
        }
        previous_written_position = [y,x]
        for (var i=0;i < current_ship;i++){
            grid[y][x+i] = "O"
            grid = ban_place(grid,y,x+i,previous_written_position,"o")
            previous_written_position = [y,x+i]
        }
        show_grid(grid,ctx,false)
        temporary_player_grid = make_full_copy_of_grid(grid)
        current_ship_placed = true
        return 

    } else{
        
        if(y>(10-current_ship)){
            return false
        }
        for (var i=0;i < current_ship;i++){
            if(grid[y+i][x] === "O" || grid[y+i][x] === "o"){
                return false
            }
        }
        previous_written_position = [y,x]
        for (var i=0;i < current_ship;i++){
            grid[y+i][x] = "O"
            grid = ban_place(grid,y+i,x,previous_written_position,"o")
            previous_written_position = [y+i,x]
        }
        show_grid(grid,ctx,false)
        temporary_player_grid = make_full_copy_of_grid(grid)
        current_ship_placed = true
        return 
    }
}
function place_computer_ship_at_position(ship_size,position_x_y,horizontal_position,grid_){
    var grid = make_full_copy_of_grid(grid_)
    var x = position_x_y[0]
    var y = position_x_y[1]
    var previous_written_position
    if (horizontal_position){
        if(x>(10-ship_size)){
            return false
        } 
        for (var i=0;i < ship_size;i++){
            if(grid[y][x+i] === "O" || grid[y][x+i] === "o"){
                return false
            }
        }
        previous_written_position = [y,x]
        for (var i=0;i < ship_size;i++){
            grid[y][x+i] = "O"
            grid = ban_place(grid,y,x+i,previous_written_position,"o")
            previous_written_position = [y,x+i]
        }
        return [true,grid]

    } else{
        
        if(y>(10-ship_size)){
            return false
        }
        for (var i=0;i < ship_size;i++){
            if(grid[y+i][x] === "O" || grid[y+i][x] === "o"){
                return false
            }
        }
        previous_written_position = [y,x]
        for (var i=0;i < ship_size;i++){
            grid[y+i][x] = "O"
            grid = ban_place(grid,y+i,x,previous_written_position,"o")
            previous_written_position = [y+i,x]
        }
        return [true,grid]

    }
}
function show_grid(grid_,ctx,is_a_computer_grid){
    if (is_a_computer_grid){
        for (var i = 0;i<10;i++){
            for (var i2 = 0;i2<10;i2++){
                switch (grid_[i][i2]) {
                    case "-":
                    case "o":
                    case "O":
                        ctx.strokeRect(700+i2*40,100+i*40,40,40);
                        break;
                    case "m":
                        ctx.fillStyle = '#9AF2FF'//changing color of ctx
                        ctx.fillRect(702+i2*40,102+i*40,36,36)
                        break;
                    case "x":
                        ctx.fillStyle = 'red'//changing color of ctx
                        ctx.fillRect(702+i2*40,102+i*40,36,36)
                        break;
                    default:
                        break;
                }
            }
    }
    }else{
        for (var i = 0;i<10;i++){
            for (var i2 = 0;i2<10;i2++){
                switch (grid_[i][i2]) {
                    case "-":
                    case "o":
                    case "f":
                        ctx.strokeRect(100+i2*40,100+i*40,40,40);
                        ctx.fillStyle = '#51A9FF'
                        ctx.fillRect(102+i2*40,102+i*40,36,36)
                        break;
                    case "O":
                        ctx.strokeRect(100+i2*40,100+i*40,40,40);
                        ctx.fillStyle = 'grey'//changing color of ctx
                        ctx.fillRect(102+i2*40,102+i*40,36,36)
                        break;
                    case "m":
                        ctx.fillStyle = '#9AF2FF'
                        ctx.fillRect(102+i2*40,102+i*40,36,36)
                        break;
                    case "x":
                        ctx.fillStyle = 'red'
                        ctx.fillRect(102+i2*40,102+i*40,36,36)
                        break;
                    default:
                        break;
                }
                console.log(grid_[i])
            }
        }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function show_current_ship() {
    var length = current_ship*40
    if(horizontal_position){
        ctx.fillStyle = 'white'
        ctx.fillRect(10,10,40,160)
        ctx.fillStyle = 'grey'
        ctx.fillRect(10,10,length,40)
    }else{
        ctx.fillStyle = 'white'
        ctx.fillRect(10,10,160,40)
        ctx.fillStyle = 'grey'
        ctx.fillRect(10,10,40,length)
    }
}
function rotate(){
    horizontal_position = !horizontal_position
    show_current_ship()
}
function ban_place(grid_,y,x,previous_written_position,ban_label) {
    var grid = make_full_copy_of_grid(grid_)
    let previous_label
    if (ban_label ==="o"){
        previous_label = "O"
    }
    if (ban_label ==="f"){
        previous_label = "x"
    }
    if (x==0&&y==9){
        if (grid[8][0] !== "m"){
        grid[8][0] = ban_label
        }
        if (grid[9][1] !== "m"){
        grid[9][1] = ban_label
    }
        if (grid[8][1] !== "m"){
        grid[8][1] = ban_label
    }
        grid[previous_written_position[0]][previous_written_position[1]] = previous_label
        return grid
    }else if(x==9&&y==0){
        if (grid[0][8] !== "m"){
        grid[0][8] = ban_label
    }
        if (grid[1][9] !== "m"){
        grid[1][9] = ban_label
    }
        if (grid[1][8] !== "m"){
        grid[1][8] = ban_label
    }
        grid[previous_written_position[0]][previous_written_position[1]] = previous_label
        return grid
    }else if(x==9&&y==9){
        if (grid[9][8] !== "m"){
        grid[9][8] = ban_label
    }
        if (grid[8][9] !== "m"){
        grid[8][9] = ban_label
    }
        if (grid[8][8] !== "m"){
        grid[8][8] = ban_label
    }
        grid[previous_written_position[0]][previous_written_position[1]] = previous_label
        return grid
    }else if(x==0&&y==0){
        if (grid[1][0] !== "m"){
        grid[1][0] = ban_label
    }
        if (grid[1][1] !== "m"){
        grid[1][1] = ban_label
    }
        if (grid[0][1] !== "m"){
        grid[0][1] = ban_label
    }
        grid[previous_written_position[0]][previous_written_position[1]] = previous_label
        return grid
    } else if(x==0&&y){
        if (grid[y+1][0] !== "m"){
        grid[y+1][0] = ban_label
    }
        if (grid[y-1][0] !== "m"){
        grid[y-1][0] = ban_label
    }
        if (grid[y+1][1] !== "m"){
        grid[y+1][1] = ban_label
    }
        if (grid[y][1] !== "m"){
        grid[y][1] = ban_label
    }
        if (grid[y-1][1] !== "m"){
        grid[y-1][1] = ban_label
    }
        grid[previous_written_position[0]][previous_written_position[1]] = previous_label
        return grid
    }else if(x==9&&y){
        if (grid[y+1][9] !== "m"){
        grid[y+1][9] = ban_label
    }
        if (grid[y-1][9] !== "m"){
        grid[y-1][9] = ban_label
    }
        if (grid[y+1][8] !== "m"){
        grid[y+1][8] = ban_label
    }
        if (grid[y][8] !== "m"){
        grid[y][8] = ban_label
    }
        if (grid[y-1][8] !== "m"){
        grid[y-1][8] = ban_label
    }
        grid[previous_written_position[0]][previous_written_position[1]] = previous_label
        return grid
    }else if(x&&y==0){
        if (grid[0][x-1] !== "m"){
        grid[0][x-1] = ban_label
    }
        if (grid[0][x+1] !== "m"){
        grid[0][x+1] = ban_label
    }
        if (grid[1][x-1] !== "m"){
        grid[1][x-1] = ban_label
    }
        if (grid[1][x] !== "m"){
        grid[1][x] = ban_label
    }
        if (grid[1][x+1] !== "m"){
        grid[1][x+1] = ban_label
    }
        grid[previous_written_position[0]][previous_written_position[1]] = previous_label
        return grid
    }else if(x&&y==9){
        if (grid[9][x-1] !== "m"){
        grid[9][x-1] = ban_label
    }
        if (grid[9][x+1] !== "m"){
        grid[9][x+1] = ban_label
    }
        if (grid[8][x-1] !== "m"){
        grid[8][x-1] = ban_label
    }
        if (grid[8][x] !== "m"){
        grid[8][x] = ban_label
    }
        if (grid[8][x+1] !== "m"){
        grid[8][x+1] = ban_label
    }
        grid[previous_written_position[0]][previous_written_position[1]] = previous_label
        return grid
    }else {
        if (grid[y][x-1] !== "m"){
        grid[y][x-1] = ban_label
    }
        if (grid[y][x+1] !== "m"){
        grid[y][x+1] = ban_label
    }
        if (grid[y-1][x] !== "m"){
        grid[y-1][x] = ban_label
    }
        if (grid[y+1][x] !== "m"){
        grid[y+1][x] = ban_label
    }
        if (grid[y-1][x-1] !== "m"){
        grid[y-1][x-1] = ban_label
    }
        if (grid[y-1][x+1] !== "m"){
        grid[y-1][x+1] = ban_label
    }
        if (grid[y+1][x-1] !== "m"){
        grid[y+1][x-1] = ban_label
    }
        if (grid[y+1][x+1] !== "m"){
        grid[y+1][x+1] = ban_label
    }
        grid[previous_written_position[0]][previous_written_position[1]] = previous_label
        return grid
    }
        
}
