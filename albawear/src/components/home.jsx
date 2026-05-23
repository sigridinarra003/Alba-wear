import './home.css';

function Home() {
  return (
    <div className="principal">
      <div className="fondo">
        <img src="/img/logo.png" className="logo" alt="logo" />
      </div>

      <nav>
        <ul className="lista">
          <li>Inicio</li>
          <li>Categorías</li>
          <li>Accesorios</li>
        </ul>
      </nav>

      <div className="carrusel-wrapper">

        <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">

          <div class="carousel-inner mb-5">
            <div class="carousel-item active">
              <img src="/img/imagen1.png" class="d-block w-100" alt="..." />
            </div>
            <div class="carousel-item">
              <img src="/img/p-2.jpg" class="d-block w-100" alt="..." />
            </div>
            <div class="carousel-item">
              <img src="/img/p-3.png" class="d-block w-100" alt="..." />
            </div>
            <div class="carousel-item">
              <img src="/img/p-4.png" class="d-block w-100" alt="..." />
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
          
        </div>

        <h1> Productos Destacados</h1>

      </div>
      <div className="p-destacados">
        <img src="/img/p-1.jpg" alt="" />
        <img src="/img/p-2.jpg" alt="" />
        <img src="/img/p-3.png" alt="" />
        <img src="/img/p-4.png" alt="" />

      </div>
    </div>
  );
}

export default Home;