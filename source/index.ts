const renderData = (data: any) => {
  console.log(data);
}

fetch(`https://23.javascript.pages.academy/keksobooking/data`)
  .then((res) => res.json())
  .then((data) => renderData(data))
  .catch((err) => console.log(`alalalalalal` + err))
