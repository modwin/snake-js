// Program för att ta bort och lägga till klassen "active" till flikar och content-panel.
$(document).ready(() => {

  const $highscore = $('#highscore');
  const HIGHSCORE = sessionStorage.getItem('highscore');

  // Klick-hanterare som tar bort det sparade rekordet för spelet.
  $('#reset-highscore').on('click', (e) => {
    e.stopPropagation();
    e.preventDefault();

    let result = confirm('Är du säker att du vill rensa ditt tidigare rekord?');
    if(result){
      $highscore.text('Inget sparat highscore.')
      sessionStorage.removeItem('highscore');
      alert('Rekordet rensades.')
    }

  })

  /**
   * Händelselyssnare för klick på flikar. När användaren klickar på en flik
   * aktiveras den och de andra flikarna avaktiveras, dessutom stängs
   * menyerna i #nav-bar.
   */
  $('.tab').click(function() {
    $('.drop-down').fadeOut(100);
    $('.tab').removeClass('active');

    $(this).addClass('active');

    $('.content-panel').removeClass('active');

    const tabId = $(this).data('tab');
    $('#' + tabId).addClass('active');
  });

  // Klick-hanterare för spara-knappen som sparar användarens val av färger till sessionStorage.
  $('#settings-form').on('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    let appleColor = $('#apple-color').val();
    let snakeColor = $('#snake-color').val();

    sessionStorage.setItem('snakeColor', snakeColor);
    sessionStorage.setItem('appleColor', appleColor);

  })

  // Klick-hanterare som sparar användarens val för ormens egenskaper till sessionStorage.
  $('#snake-properties').on('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    let snakeSpeed = $('#snake-speed').val();

    sessionStorage.setItem('snakeSpeed', snakeSpeed);
  })

  const url = window.location.href;
  if(!url.includes('file://')) history.pushState(null, null, 'settings');
  $highscore.text(HIGHSCORE === undefined || HIGHSCORE === null ? 'Inget sparat highscore.' : `Ditt highscore: ${HIGHSCORE}` )
})
