const PaginationButtons = ({ currentPage, totalPages, goToPage }) => {
    // Function to render pagination buttons
    const renderPaginationButtons = () => {
        const buttons = [];

        if (totalPages <= 4) {
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(
                    <button
                        key={i}
                        onClick={() => goToPage(i)}
                        className={`paginationBtn ${currentPage === i ? 'paginationBtnActive' : ''}`
                    }
                    >
                        {i}
                    </button>
                );
            }
        } else {
            // Always show the first page
            buttons.push(
                <button key={1} onClick={() => goToPage(1)} className={`paginationBtn ${currentPage === 1 ? 'paginationBtnActive' : ''}`}
                >
                    1
                </button>
            );
            if (currentPage < 3) {
                for (let i = 2; i <= 4; i++) {
                    buttons.push(
                        <button
                            key={i}
                            onClick={() => goToPage(i)}
                            className={`paginationBtn ${currentPage === i ? 'paginationBtnActive' : ''}`}
                        >
                            {i}
                        </button>
                    );
                }
            }

            // Add ellipsis if currentPage is greater than 3
            if (currentPage > 3) {
                buttons.push(<span key="ellipsis-1">...</span>);
            }

            // Add previous page button if applicable
            if (currentPage > 2) {
                buttons.push(
                    <button key={currentPage - 1} onClick={() => goToPage(currentPage - 1)} className="paginationBtn">
                        {currentPage - 1}
                    </button>
                );
            }

            // Always show the current page
            buttons.push(
                <button key={currentPage} onClick={() => goToPage(currentPage)}
                    className={`paginationBtn paginationBtnActive`}
                >
                    {currentPage}
                </button>
            );

            // Add next page button if applicable
            if (currentPage < totalPages - 1) {
                buttons.push(
                    <button key={currentPage + 1} onClick={() => goToPage(currentPage + 1)} className="paginationBtn">
                        {currentPage + 1}
                    </button>
                );
            }

            // Add ellipsis if currentPage is less than totalPages - 2
            if (currentPage < totalPages - 2) {
                buttons.push(<span key="ellipsis-2">...</span>);
            }

            // Always show the last page
            buttons.push(
                <button key={totalPages} onClick={() => goToPage(totalPages)} className={`paginationBtn ${currentPage === totalPages ? 'paginationBtnActive' : ''}`}
                >
                    {totalPages}
                </button>
            );
        }

        // Remove duplicates (if any)
        const uniqueButtons = buttons.filter((button, index, self) =>
            index === self.findIndex((b) => b.key === button.key)
        );

        return uniqueButtons;
    };

    return (
        <>
            {renderPaginationButtons()}
        </>
    )
}
export default PaginationButtons;