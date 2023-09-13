import { useEffect, useState } from "react";
import { CardView } from "../../electron/main/AppFramework";
import { deserialize } from "react-serialize";

const CardComponent = ({ cardId, fallback }: { cardId: string, fallback?: JSX.Element }) => {
  const [cardComponent, setCardComponent] = useState<JSX.Element>(fallback || <div>component loading</div>);

  useEffect(() => {
    window.ContextBridge.executeCommand("sailfish.getCard", cardId).then((card: unknown) => {
      (async () => {
        console.log(card);
        const extensionObject = deserialize(card);
        setCardComponent(extensionObject);
      })();
    });
  }, [cardId]);

  return cardComponent;
};

export default CardComponent;