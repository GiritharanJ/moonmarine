<?php
/**
 * Moon Marine — contact.php
 * PHPMailer + Gmail SMTP (works on XAMPP & cPanel)
 * 
 * SETUP STEPS:
 * 1. Download PHPMailer: https://github.com/PHPMailer/PHPMailer/releases
 *    Extract → rename folder to "PHPMailer" → place inside moonmarine/
 * 2. Enable Gmail 2FA → create App Password (16 chars)
 *    Google Account → Security → 2-Step Verification → App Passwords
 * 3. Fill SMTP_USER and SMTP_PASS below
 * 4. For cPanel: change SMTP_HOST to 'mail.yourdomain.com', use cPanel email
 */

// ── CONFIG ────────────────────────────────────────────────────
define('SMTP_HOST',  'smtp.gmail.com');
define('SMTP_PORT',  587);
define('SMTP_USER',  'moonmarinenavicationcomunicati@gmail.com'); // your Gmail
define('SMTP_PASS',  'moonmarine289538');                // Gmail App Password
define('MAIL_FROM',  'moonmarinenavicationcomunicati@gmail.com');
define('MAIL_FROM_NAME', 'Moon Marine Website');
define('MAIL_TO',    'moonmarinenavicationcomunicati@gmail.com'); // owner receives here
define('MAIL_TO_NAME',   'Moon Marine Owner');
// ─────────────────────────────────────────────────────────────

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// ── Sanitize inputs ───────────────────────────────────────────
function clean($val) {
    return htmlspecialchars(strip_tags(trim($val ?? '')), ENT_QUOTES, 'UTF-8');
}

$name       = clean($_POST['name']       ?? '');
$phone      = clean($_POST['phone']      ?? '');
$service    = clean($_POST['service']    ?? 'Not specified');
$location   = clean($_POST['location']   ?? 'Not specified');
$message    = clean($_POST['message']    ?? 'No message');
$payment_id = clean($_POST['payment_id'] ?? 'No payment');
$amount     = clean($_POST['amount']     ?? '');

// Basic validation
if (empty($name) || empty($phone)) {
    echo json_encode(['status' => 'error', 'message' => 'Name and phone are required']);
    exit;
}

if (!preg_match('/^\d{10}$/', preg_replace('/\D/', '', $phone))) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid phone number']);
    exit;
}

// ── Load PHPMailer ────────────────────────────────────────────
$phpmailer_path = __DIR__ . '/PHPMailer/src/';

if (!file_exists($phpmailer_path . 'PHPMailer.php')) {
    // PHPMailer not installed — log and respond OK (don't break frontend)
    error_log('PHPMailer not found. Install it in ' . $phpmailer_path);
    echo json_encode(['status' => 'success', 'message' => 'Received (email unavailable — install PHPMailer)']);
    exit;
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require $phpmailer_path . 'Exception.php';
require $phpmailer_path . 'PHPMailer.php';
require $phpmailer_path . 'SMTP.php';

// ── Build email body ──────────────────────────────────────────
$date_str = date('d M Y, h:i A');

$html_body = "
<!DOCTYPE html>
<html>
<head><meta charset='UTF-8'><style>
body{font-family:Arial,sans-serif;background:#f4f6f9;margin:0;padding:20px;}
.card{background:#fff;border-radius:12px;max-width:520px;margin:0 auto;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);}
.header{background:#111733;padding:24px 30px;text-align:center;}
.header h1{color:#4dd9d0;margin:0;font-size:1.4rem;}
.header p{color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:0.85rem;}
.body{padding:28px 30px;}
.row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:0.9rem;}
.row:last-child{border-bottom:none;}
.label{color:#888;font-weight:600;}
.value{color:#222;font-weight:600;text-align:right;max-width:65%;}
.badge{display:inline-block;padding:4px 12px;background:" . ($payment_id !== 'No payment' && $payment_id !== 'WhatsApp Booking' ? '#d4edda' : '#fff3cd') . ";color:" . ($payment_id !== 'No payment' && $payment_id !== 'WhatsApp Booking' ? '#155724' : '#856404') . ";border-radius:20px;font-size:0.8rem;font-weight:700;}
.footer{background:#f8f9fa;padding:14px 30px;text-align:center;font-size:0.78rem;color:#aaa;}
</style></head>
<body>
<div class='card'>
  <div class='header'>
    <h1>🚢 New Booking — Moon Marine</h1>
    <p>Received on $date_str</p>
  </div>
  <div class='body'>
    <div class='row'><span class='label'>Customer</span><span class='value'>$name</span></div>
    <div class='row'><span class='label'>Phone</span><span class='value'>+91 $phone</span></div>
    <div class='row'><span class='label'>Service</span><span class='value'>$service</span></div>
    <div class='row'><span class='label'>Location</span><span class='value'>$location</span></div>
    <div class='row'><span class='label'>Message</span><span class='value'>$message</span></div>
    <div class='row'><span class='label'>Payment ID</span><span class='value'><span class='badge'>$payment_id</span></span></div>
    " . ($amount ? "<div class='row'><span class='label'>Amount</span><span class='value'>$amount</span></div>" : '') . "
  </div>
  <div class='footer'>Moon Marine Services · Tharangambadi, Tamil Nadu · +91 7708007222</div>
</div>
</body>
</html>";

$text_body = "NEW BOOKING — MOON MARINE\n" .
    "Date:       $date_str\n" .
    "Customer:   $name\n" .
    "Phone:      +91 $phone\n" .
    "Service:    $service\n" .
    "Location:   $location\n" .
    "Message:    $message\n" .
    "Payment ID: $payment_id\n" .
    ($amount ? "Amount:     $amount\n" : '');

// ── Send via PHPMailer ────────────────────────────────────────
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = SMTP_PORT;
    $mail->CharSet    = 'UTF-8';

    // For XAMPP local testing — disable SSL cert verification
    $mail->SMTPOptions = [
        'ssl' => [
            'verify_peer'       => false,
            'verify_peer_name'  => false,
            'allow_self_signed' => true,
        ]
    ];

    // From / To
    $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
    $mail->addAddress(MAIL_TO, MAIL_TO_NAME);
    $mail->addReplyTo(MAIL_FROM, $name);

    // Subject
    $subject_prefix = ($payment_id !== 'No payment' && $payment_id !== 'WhatsApp Booking')
        ? '💰 Paid Booking'
        : '📋 Service Enquiry';
    $mail->Subject = $subject_prefix . ' — ' . $name . ' (' . $service . ')';

    // Body
    $mail->isHTML(true);
    $mail->Body    = $html_body;
    $mail->AltBody = $text_body;

    $mail->send();

    echo json_encode([
        'status'  => 'success',
        'message' => 'Email sent successfully'
    ]);

} catch (Exception $e) {
    error_log('Moon Marine Mail Error: ' . $mail->ErrorInfo);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Email failed: ' . $mail->ErrorInfo
    ]);
}
