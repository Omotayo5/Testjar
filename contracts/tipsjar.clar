(define-map tips
  { sender: principal, recipient: principal }
  { amount: uint, message: (string-utf8 280) })

(define-public (tip (recipient principal) (amount uint) (message (string-utf8 280)))
  (let ((sender tx-sender))
    (match (stx-transfer? amount sender recipient)
      transfer-result
      (begin
        (map-set tips { sender: sender, recipient: recipient } { amount: amount, message: message })
        (ok true))
      transfer-error
      (err transfer-error))))

(define-read-only (get-tip (sender principal) (recipient principal))
  (match (map-get? tips { sender: sender, recipient: recipient })
    tip-data (some (get amount tip-data))
    none))

(define-read-only (get-tip-with-message (sender principal) (recipient principal))
  (map-get? tips { sender: sender, recipient: recipient }))
