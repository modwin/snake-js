// Program för ett klassiskt Snake-spel
$(document).ready(()=>{
  // Konstanter för element
  const $topBorder = $('.header');
  const $gameContainer = $('#game-container');
  const $bottomBorder = $('.border-bottom');
  const $leftBorder = $('.border-left');
  const $rightBorder = $('.border-right');
  const $gameInfo = $('#game-info');
  const $highscore = $('.highscore');

  // Konstanter som sparar
  const USER_SPEED_CHOICE = sessionStorage.getItem('snakeSpeed');
  const SNAKE_COLOR_USER_CHOICE = sessionStorage.getItem('snakeColor');
  const APPLE_COLOR_USER_CHOICE = sessionStorage.getItem('appleColor');

  // Konstanter för styrning och beteende av ormen.
  const SEGMENT_SIZE = 20;
  const SPEED = SEGMENT_SIZE;
  const GAME_LOOP_TICK_RATE = USER_SPEED_CHOICE === undefined || USER_SPEED_CHOICE === null ? 50 : 50 / USER_SPEED_CHOICE;
  const VALID_INPUTS = ['w', 'W', 'a', 'A', 'S', 's', 'd', 'D', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

  // Variabler för spelets logik och sparande av poäng
  let head;
  let xInput = 0, yInput = 0;
  let segments = [], positions = [];
  let canMove = true;
  let alive = false, appleExists = false;
  let score = 0;
  let highscore = parseInt(sessionStorage.getItem('highscore'));

  // Övre kanten för spelplanen med titel
  $topBorder.on('click', () => window.location.href = 'home.html')

  // Hanterar klick-händelser på #game-info, anropar #resetGame.
  $gameInfo.on('click', () => {
    if(!alive){
      resetGame();
    }
  })

  // Keydown-hanterare som avgör logiken för styrning av ormen.
  $(document).on('keydown', (e)=>{
    if(!canMove || !VALID_INPUTS.includes(e.key)) return false;
    setTimeout(() => {canMove = true;}, GAME_LOOP_TICK_RATE);

    if(canMove){
      canMove = false;
      switch(e.key){
        case 'd': case 'ArrowRight': case 'D':{
          if(xInput === 0){
            yInput = 0;
            xInput = SPEED;
          }
          break;
        }
        case 'a': case 'ArrowLeft': case 'A': {
          if(xInput === 0){
            yInput = 0;
            xInput = -SPEED;
          }
          break;
        }
        case 's': case 'ArrowDown': case 'S': {
          if(yInput === 0){
            yInput = SPEED;
            xInput = 0;
          }
          break;
        }
        case 'w': case 'ArrowUp': case 'W': {
          if (yInput === 0){
            yInput = -SPEED;
            xInput = 0;
          }
          break;
        }
        default: {
          e.preventDefault();
          e.stopPropagation();
          break;
        }
      }
    }

  })

  // Återställer spelets variabler och anropar #gameLoop.
  function resetGame(){
    if(!alive){
      $gameContainer.empty();
      segments  = [];
      positions = [];
      yInput = xInput = 0;
      score = 0;
      initSnake()
      alive = true;
      $highscore.text(`Score: 0 Highscore: ${isNaN(highscore) ? 0 : highscore}`)
      $gameInfo.text('Använd WASD- eller piltangenterna för att kontrollera ormen. Börja spelet genom att börja styra!')
      gameLoop()
    }
  }

  // Skapar en orm med tre stycken 20x20 orm-segment (kvadrater)
  function initSnake() {
    addSegment($gameContainer.width() / 2, $(document).height() / 2)
    for (let i = 0; i < 3; i++) growSnake();
  }

  /// Lägger till ett ytterligare segment efter ormens svans (det sista segmentet).
  function growSnake() {
    const tail = positions[positions.length - 1];
    addSegment(tail.x, tail.y );
    positions.push({ ...tail });
  }

  // Skapar ett segment som HTML-element och sparar i en array.
  function addSegment(x, y) {
    const borderRadius = segments.length > 0 ? '0' : '10px'
    let color = SNAKE_COLOR_USER_CHOICE === null || undefined ? 'green' : SNAKE_COLOR_USER_CHOICE;
    const $segment = $('<div class="snake-segment"></div>');
    $gameContainer.append($segment);
    $segment.css({
      background: color,
      left: '50%',
      top:  '50%',
      width: SEGMENT_SIZE + 'px',
      height: SEGMENT_SIZE + 'px',
      borderRadius: borderRadius,
    });
    segments.push($segment);
    positions.push({ x, y });
  }
  // Uppdaterar ormens position på skärmen för rendering av webbläsaren.
  function updateSnake() {
    const newX = head.x + xInput;
    const newY = head.y + yInput;
    positions.unshift({ x: newX, y: newY });

    positions.pop();

    segments.forEach(($segment, index) => {
      // const borderRadius = index > 0 ? '0' : '10px'
      const pos = positions[index];
      const x = pos.x;
      const y = pos.y;
      $segment.css({
        left: x + 'px',
        top: y + 'px',
        display: 'block',
        // borderRadius: borderRadius,
      });
    });
  }

  // Skapar ett äpple på slumpvis plats på spelplanen och get CSS-attribut för rendering.
  function spawnApple(){
    let color = APPLE_COLOR_USER_CHOICE === null || undefined ? 'red' : APPLE_COLOR_USER_CHOICE;
    const apple =$('<div class="apple"></div>');
    $gameContainer.append(apple);

    apple.css({
      background: color,
      left: getRandomX()  + 'px',
      top: getRandomY() + 'px',
      position: 'absolute',
      display: 'block',
      width: SEGMENT_SIZE,
      height: SEGMENT_SIZE,
    })
    appleExists=true;
  }

  // Genererar ett randomiserat X-värde på spelplanen.
  function getRandomX(){
    const pageSize = $(document).width()
    const min = $leftBorder.width() + SEGMENT_SIZE;
    const max = (pageSize - ($rightBorder.width() + SEGMENT_SIZE*2));

    return Math.random() * (max -min) + min;

  }

  // Genererar ett randomiserat Y-värde på spelplanen.
  function getRandomY(){
    const min = $bottomBorder.height() + SEGMENT_SIZE*2;
    const max = $(document).height() - $topBorder.height() - SEGMENT_SIZE*2;
    return Math.random() * (max - min) + min;
  }

  // Beräknar kollision mellan äpplet och ormens huvud.
  function checkAppleCollision(){
    if(appleExists){
      const apple = $('.apple');
      const appleY = apple.offset().top;
      const appleX = apple.offset().left;

      const isCollision =
        head.x < appleX + SEGMENT_SIZE &&
        head.x + SEGMENT_SIZE > appleX &&
        head.y < appleY + SEGMENT_SIZE &&
        head.y + SEGMENT_SIZE > appleY;
      if (isCollision) {
        growSnake();
        apple.remove();
        appleExists = false;
        score = score+1
        highscore = highscore === null || highscore > score ? highscore : score;
        $highscore.text(`Score: ${score} Highscore: ${highscore}`)

      }
    }
  }

  // Beräknar i fall huvudet kolliderar med kroppen, returnerar true om kollision ägt rum, annars false.
  function checkSelfCollision() {
    if(segments.length > 4){
      for (let i = 1; i < segments.length; i++) {
        head = positions[0];
        let collided = (
          head.x < segments[i].offset().left + SEGMENT_SIZE &&
          head.x + SEGMENT_SIZE > segments[i].offset().left &&
          head.y < segments[i].offset().top + SEGMENT_SIZE &&
          head.y + SEGMENT_SIZE > segments[i].offset().top);
        if(collided) return true;
      }
    }
    else return false;
  }

  // Kontrollerar att ormens huvud inte har kolliderat med spelplanens kanter.
  function checkBorderCollision(){
    return !(
      head.y > $topBorder.height()  &&
      head.y + SEGMENT_SIZE < $bottomBorder.offset().top  &&
      head.x + SEGMENT_SIZE / 10  > $leftBorder.width() &&
      head.x < $rightBorder.offset().left-  + SEGMENT_SIZE
    );
  }

  function gameLoop() {
    head = positions[0];
    appleExists = $gameContainer.children().hasClass('apple');

    if (!alive) return;
    if(!appleExists) spawnApple();
    else{
      checkAppleCollision();
    }
    alive = !checkSelfCollision() && !checkBorderCollision();
    updateSnake();

    if(alive){

      setTimeout(gameLoop, GAME_LOOP_TICK_RATE);
    }else {
      highscore = score > highscore ? score : highscore;
      sessionStorage.setItem('highscore', highscore === undefined || null ? 0 : highscore);
      $gameInfo.text('Du förlorade! Tryck här för att försöka igen!')
    }
  }

  const url = window.location.href;
  if(!url.includes('file://')) history.pushState(null, null, 'snake')
  $highscore.text(`Score: 0 Highscore: ${isNaN(highscore) ? 0 : highscore}`)

  if(!alive){
    initSnake();
    alive = true;
    gameLoop();
  }

})
