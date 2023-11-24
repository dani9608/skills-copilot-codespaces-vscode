function skillsMember() {
    const member = document.querySelector('.member');
    const memberList = document.querySelector('.member-list');
    const memberItem = document.querySelectorAll('.member-item');
    const memberClose = document.querySelector('.member-close');
    const memberOverlay = document.querySelector('.member-overlay');
  
    member.addEventListener('click', function () {
      memberList.classList.add('active');
    });
  
    memberClose.addEventListener('click', function () {
      memberList.classList.remove('active');
    });
  
    memberOverlay.addEventListener('click', function () {
      memberList.classList.remove('active');
    });
  
    memberItem.forEach(function (e) {
      e.addEventListener('click', function () {
        memberList.classList.remove('active');
      });
    });
  }
  