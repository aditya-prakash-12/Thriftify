function SearchOffcanvas() {
  return (
    <div
      className="offcanvas offcanvas-end"
      data-bs-scroll="true"
      tabIndex="-1"
      id="offcanvasSearch"
      aria-labelledby="offcanvasSearchLabel"
    >
      <div className="offcanvas-header justify-content-center">
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>

      <div className="offcanvas-body">
        <div className="order-md-last">
          <h4 className="mb-3">
            <span className="text-primary">Search</span>
          </h4>

          <form className="d-flex mt-3 gap-0">
            <input
              className="form-control rounded-start rounded-0 bg-light"
              type="text"
              placeholder="What are you looking for?"
            />
            <button className="btn btn-dark rounded-end rounded-0">
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SearchOffcanvas;