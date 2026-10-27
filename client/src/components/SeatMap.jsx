import React from 'react';

const SeatMap = ({
  seats = [],
  selectedSeats = [],
  onSeatToggle,
  ticketPrice = { standard: 12, premium: 18, vip: 28 },
}) => {
  // Group seats by Row
  const rowsMap = {};
  seats.forEach((seat) => {
    if (!rowsMap[seat.row]) {
      rowsMap[seat.row] = [];
    }
    rowsMap[seat.row].push(seat);
  });

  // Sort rows and seats within row
  const sortedRowKeys = Object.keys(rowsMap).sort();
  sortedRowKeys.forEach((key) => {
    rowsMap[key].sort((a, b) => a.seatNumber - b.seatNumber);
  });

  return (
    <div className="w-100">
      {/* Cinema Screen Curve */}
      <div className="cinema-screen-container">
        <div className="cinema-screen-curve"></div>
        <div className="cinema-screen-text">
          <i className="bi bi-display me-2 text-primary"></i> SCREEN THIS WAY
        </div>
      </div>

      {/* Seat Legend */}
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-4 my-4 p-3 glass-panel">
        <div className="seat-legend-box">
          <div className="seat-legend-indicator" style={{ backgroundColor: 'var(--seat-available)' }}></div>
          <span>Available</span>
        </div>
        <div className="seat-legend-box">
          <div className="seat-legend-indicator" style={{ backgroundColor: 'var(--seat-selected)' }}></div>
          <span>Selected</span>
        </div>
        <div className="seat-legend-box">
          <div className="seat-legend-indicator" style={{ backgroundColor: 'var(--seat-booked)' }}></div>
          <span>Booked</span>
        </div>
        <div className="seat-legend-box">
          <div className="seat-legend-indicator" style={{ backgroundColor: 'var(--seat-unavailable)' }}></div>
          <span>Unavailable</span>
        </div>
      </div>

      {/* Seating Layout Grid */}
      <div className="p-3 p-md-4 glass-panel overflow-auto text-center mb-4" style={{ minHeight: '380px' }}>
        <div className="d-inline-block text-center py-2" style={{ minWidth: '340px' }}>
          {sortedRowKeys.map((rowKey) => {
            const rowSeats = rowsMap[rowKey];
            const rowCategory = rowSeats[0]?.category || 'Standard';

            return (
              <div key={rowKey} className="seat-row">
                <span className="seat-row-label" title={`Row ${rowKey}`}>
                  {rowKey}
                </span>

                <div className="d-flex gap-2">
                  {rowSeats.map((seat) => {
                    const isSelected = selectedSeats.some((s) => s.seatId === seat.seatId);
                    const isBooked = seat.status === 'booked';
                    const isUnavailable = seat.status === 'unavailable';

                    let stateClass = 'available';
                    if (isBooked) stateClass = 'booked';
                    else if (isUnavailable) stateClass = 'unavailable';
                    else if (isSelected) stateClass = 'selected';

                    return (
                      <button
                        key={seat.seatId}
                        type="button"
                        className={`seat-unit border-0 ${stateClass}`}
                        disabled={isBooked || isUnavailable}
                        onClick={() => onSeatToggle(seat)}
                        title={`Seat ${seat.seatId} (${seat.category || rowCategory}) - $${seat.price || ticketPrice.standard}`}
                      >
                        {seat.seatNumber}
                      </button>
                    );
                  })}
                </div>

                <span className="seat-row-label" title={`Row ${rowKey}`}>
                  {rowKey}
                </span>
              </div>
            );
          })}
        </div>

        {/* Category Pricing Guide */}
        <div className="d-flex flex-wrap justify-content-center gap-3 pt-4 border-top border-secondary border-opacity-25 mt-3 small text-secondary">
          <span className="badge bg-dark border border-secondary px-3 py-2">
            Standard: <strong className="text-white">${ticketPrice.standard || 12}</strong>
          </span>
          <span className="badge bg-dark border border-warning px-3 py-2">
            Premium: <strong className="text-warning">${ticketPrice.premium || 18}</strong>
          </span>
          <span className="badge bg-dark border border-danger px-3 py-2">
            VIP Recliner: <strong className="text-danger">${ticketPrice.vip || 28}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
