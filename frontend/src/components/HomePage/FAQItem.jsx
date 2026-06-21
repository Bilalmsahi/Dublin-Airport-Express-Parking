import React, { useState } from 'react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <div
        className="faq-question"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{question.replace("RS Express Parking", "Dublin Airport Express Parking")}</span>
        <span className="faq-icon">{isOpen ? '-' : '+'}</span>
      </div>
      {isOpen && (
        <div className="faq-answer">
          <div dangerouslySetInnerHTML={{ __html: answer.replaceAll("support@rsexpressparking.com", "support@dublinairportexpressparking.ie").replace("<strong>Flexible Meet & Greet:</strong> €65 base price + €10 per day (cancel anytime)<br/>", "") }} />
        </div>
      )}
    </div>
  );
};

export default FAQItem;