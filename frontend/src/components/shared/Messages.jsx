import { X, CheckCircle, XCircle, Info } from 'lucide-react';
import '../../assets/style/Messages.css';

function Messages({ message, type = 'info', onClose }) {
  const iconMap = {
    success: CheckCircle,
    error: XCircle,
    info: Info
  };
  const Icon = iconMap[type] || Info;

  return (
    <div className={`message-toast message-${type}`}>
      <div className="message-content">
        <Icon size={20} />
        <span className="message-text">{message}</span>
      </div>
      <button className="message-close" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
}

export default Messages;

