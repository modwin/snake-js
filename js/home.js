// Programmet för att hantera startsidans funktioner.
$(document).ready(() => {

  const url = window.location.href;
  if(!url.includes('file://')) history.pushState(null, null, 'home')
})
