import React from "react";
import { useEffect, useState } from "react";
type SederSummaryProps = {
  sederCode: string;
  rpw: string;
};
const SederSummary = (props: SederSummaryProps) => {
  const { sederCode, rpw } = props;
  const [sederSummary, setSederSummary] = React.useState<any>();
  React.useEffect(() => {
    (async () => {
      const fetchSederSummaryResponse = await fetch(
        `../v2/seder-summary?sederCode=${sederCode}&rpw=${rpw}&roomcode=${sederCode}`
      );
      if (fetchSederSummaryResponse.status !== 200) {
        return;
      }
      const fetchSederSummaryData = await fetchSederSummaryResponse.json();
      setSederSummary(fetchSederSummaryData);
    })();
  }, []);
  if (
    !sederSummary ||
    !sederSummary.participants ||
    !sederSummary.participants.length ||
    !sederSummary.leaderName ||
    !sederSummary.createdAt
  ) {
    return <div></div>;
  }
  return (
    <div>
      <div>
        This Haggadah was initialized by <strong>{`${sederSummary.leaderName}`}</strong> on{" "}
        {sederSummary.createdAt}, Seder code begins{" "}
        <strong>{`${sederCode.substring(0, 3)}`}</strong>,{" "}
        {`${sederSummary.participants.length}`} participants.
      </div>
    </div>
  );
};
export default SederSummary;
