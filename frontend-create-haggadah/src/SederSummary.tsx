import React from "react";
import { useEffect, useState } from "react";
type SederSummaryProps = {
  sederCode: string;
  pw: string;
  ph: string;
};
const SederSummary = (props: SederSummaryProps) => {
  const { sederCode, pw, ph } = props;
  const [sederSummary, setSederSummary] = React.useState<any>();
  React.useEffect(() => {
    (async () => {
      const fetchSederSummaryResponse = await fetch(
        `../v2/seder-summary?sederCode=${sederCode}&pw=${pw}&ph=${ph}&roomcode=${sederCode}`
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
        This Haggadah was initialized by {`${sederSummary.leaderName}`} on{" "}
        {sederSummary.createdAt}, Seder code begins{" "}
        {`${sederCode.substring(0, 3)}`},{" "}
        {`${sederSummary.participants.length}`} participants.
      </div>
    </div>
  );
};
export default SederSummary;
