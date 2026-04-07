$(document).ready(() => {
// // Konfigurerar klick-händelser till metoden #activateDropdown()
  const $btn1 = $('#btn1');
  const $btn2 = $('#btn2');
  const $dropDown = $('.drop-down').on('click');

  // Klick-hanterare för headern som omdirigerar användaren till startsidan.
  $('#header').on('click', (e) => {
    window.location.href = 'home.html'
  })

  // Konfigurerar klick-händelser till metoden #activateDropdown()
  $btn1.on('click', (activateDropdown))
  $btn2.on('click', (activateDropdown))

  // Animerar dropdown-menyer på navigationslisten
  function activateDropdown(e) {
    let clickedDropDown= $(this).siblings('.drop-down');
    $dropDown.fadeOut(100);
    if(clickedDropDown.is(':hidden')){
      clickedDropDown.fadeIn(500, "swing")
    }
  }
  // Klick-hanterare för knapparna i drop-down-menyn. Förser varje knapp med en länk.
  $dropDown.on('click', (e) => {
    const text = e.target.text;
    if(text === 'Maila utvecklaren') window.location.href = 'mailto:bjorn.mwinther@gmail.com'
    else if(text === 'Spela nu') window.location.href = 'snake.html';
    else if(text === 'Inställningar') window.location.href = 'settings.html';
  })

  // Metod för att hämta dagens datum dynamiskt och lägga till det i ett element..
  function displayDate(){
    const now = new Date();
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const date = now.toLocaleDateString('sv-SE', options);
    $('#dateTime').text(now.toLocaleDateString('sv-SE', options))
    console.log(`DISPLAYING DATE = ${date}`)
  }
  displayDate();
})
