import jsPDF from "jspdf";
import { Trip } from "../types/trip";
import { Button } from "@mui/material";

type PDFGeneratorProps = {
  trip: Trip | null;
};

const PDFGenerator = ({ trip }: PDFGeneratorProps) => {
  const handleGeneratePDF = () => {
    if (!trip) {
      return;
    }
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(trip.title, 10, 20);

    doc.setFontSize(12);
    doc.text("Lists and places:", 10, 30);

    let yOffset = 40;

    trip.lists?.forEach((list) => {
      doc.setFontSize(14);
      doc.text(`- ${list.name}`, 10, yOffset);
      yOffset += 10;

      list.items?.forEach((item) => {
        doc.setFontSize(12);
        doc.text(`  • ${item.title} (${item.address})`, 15, yOffset);
        yOffset += 10;

        if (yOffset > 280) {
          doc.addPage();
          yOffset = 20;
        }
      });
    });

    if (trip.notes) {
      yOffset += 10;
      if (yOffset > 280) {
        doc.addPage();
        yOffset = 20;
      }
      doc.setFontSize(12);
      doc.text("Notes:", 10, yOffset);
      yOffset += 10;
      doc.text(trip.notes, 10, yOffset);
    }

    doc.save(`${trip.title.replace(/\s+/g, "_")}_trip.pdf`);
  };

  return (
    <Button
      className="btn-secondary"
      aria-label="Download trip as PDF"
      title="Download trip as PDF"
      onClick={handleGeneratePDF}
    >
      Download trip as PDF
    </Button>
  );
};

export default PDFGenerator;
