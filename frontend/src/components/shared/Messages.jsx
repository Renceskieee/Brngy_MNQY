import { useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import '../../assets/style/Messages.css';

function Messages({ message, type = 'info', onClose }) {
  const iconMap = {
    success: CheckCircle,
    error: XCircle,
    info: Info
  };
  const Icon = iconMap[type] || Info;

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => {
      if (onClose) onClose();
    }, 3500);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`message-toast message-${type}`} role="status">
      <div className="message-content">
        <Icon size={20} />
        <span className="message-text">{message}</span>
      </div>
    </div>
  );
}

export default Messages;


