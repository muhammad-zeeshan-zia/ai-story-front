import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib';
import download from 'downloadjs';

interface Story {
  _id: string;
  story_title: string;
  read_time: string;
  genre: string;
  enhanced_story: string;
  heroImageUrl?: string | null;
  heroImageAlignment?: "left" | "center" | "right" | null;
}

export const createStoryPDF = async (story: Story): Promise<PDFDocument> => {
  const pdfDoc = await PDFDocument.create();
  let page: PDFPage = pdfDoc.addPage();
  const { width, height } = page.getSize();

  const margin = 50;
  const titleSize = 24;
  const textSize = 12;
  const lineHeight = 1.6;

  const fontNormal: PDFFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontBold: PDFFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontItalic: PDFFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  const drawBorder = (p: PDFPage) => {
    const b = 15;
    const specs: Array<[number, number, number, number, ReturnType<typeof rgb>, number]> = [
      [b, b, width - b * 2, height - b * 2, rgb(0.1, 0.1, 0.3), 3],
      [b + 8, b + 8, width - (b + 8) * 2, height - (b + 8) * 2, rgb(0.3, 0.2, 0.5), 1.5],
      [b + 15, b + 15, width - (b + 15) * 2, height - (b + 15) * 2, rgb(0.6, 0.5, 0.7), 0.5],
    ];
    specs.forEach(([x, y, w, h, color, borderWidth]) => {
      p.drawRectangle({ x, y, width: w, height: h, borderColor: color, borderWidth });
    });
  };
  drawBorder(page);

  let y = height - margin;

  // Store image rect for wrapping decisions (declared at top level)
  let heroRect: { x: number; y: number; width: number; height: number } | null = null;
  const isSideAligned = story.heroImageAlignment === 'left' || story.heroImageAlignment === 'right';

  // If there's a hero image, try to fetch and embed it at the top
  if (story.heroImageUrl) {
    try {
      const resp = await fetch(story.heroImageUrl);
      const contentType = resp.headers.get('content-type') || '';
      const bytes = await resp.arrayBuffer();
      let embeddedImage: any = null;
      if (contentType.includes('png')) {
        embeddedImage = await pdfDoc.embedPng(bytes);
      } else {
        // fallback to JPG
        embeddedImage = await pdfDoc.embedJpg(bytes);
      }

      const imgDims = embeddedImage.scale(1);
      const availableW = width - margin * 2;
      const targetW = isSideAligned ? availableW * 0.4 : availableW; // 40% width for side, full for centered
      const scale = Math.min(1, targetW / imgDims.width);
      const drawW = imgDims.width * scale;
      const drawH = imgDims.height * scale;

      let imgX = margin;
      if (story.heroImageAlignment === 'center' || !story.heroImageAlignment) {
        imgX = margin + (availableW - drawW) / 2;
      } else if (story.heroImageAlignment === 'right') {
        imgX = width - margin - drawW;
      }

      const imageY = y - drawH;
      page.drawImage(embeddedImage, {
        x: imgX,
        y: imageY,
        width: drawW,
        height: drawH,
      });

      // Store image rect: y is bottom of image, top is y + height
      heroRect = { x: imgX, y: imageY, width: drawW, height: drawH };

      // For centered image, push content below the image. For side images, keep y at top.
      if (!isSideAligned) {
        y = imageY - 20; // leave space below image for title
      }
    } catch (e) {
      // ignore image embed errors and continue
      console.warn('Failed to embed hero image for PDF:', e);
    }
  }

  y -= 20;

  // Helper to check if current y overlaps with hero image
  const doesOverlapImage = (currentY: number, lineH: number): boolean => {
    if (!heroRect || !isSideAligned) return false;
    const lineTop = currentY;
    const lineBottom = currentY - lineH;
    const imgTop = heroRect.y + heroRect.height;
    const imgBottom = heroRect.y;
    return !(lineBottom >= imgTop || lineTop <= imgBottom);
  };

  // Helper to get text area (x, maxWidth) considering image overlap
  const getTextArea = (currentY: number, lineH: number): { xPos: number; maxW: number } => {
    const gap = 15;
    if (doesOverlapImage(currentY, lineH) && heroRect) {
      if (story.heroImageAlignment === 'left') {
        const xPos = heroRect.x + heroRect.width + gap;
        return { xPos, maxW: width - margin - xPos };
      } else {
        // right aligned
        return { xPos: margin, maxW: heroRect.x - margin - gap };
      }
    }
    return { xPos: margin, maxW: width - margin * 2 };
  };
  // Draw title using wrapping that respects a side-aligned hero image
  const drawWrappedTitle = (rawText: string, fnt: PDFFont, size: number, lineHtMult: number, color: ReturnType<typeof rgb>) => {
    const words = rawText.split(' ');
    let line = '';
    const lineHeightPx = size * lineHtMult;

    const pushLine = (ln: string) => {
      const { xPos, maxW } = getTextArea(y, lineHeightPx);
      page.drawText(ln, {
        x: xPos,
        y,
        size,
        font: fnt,
        color,
        maxWidth: maxW,
      });
      y -= lineHeightPx;
    };

    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      const { maxW: curMaxW } = getTextArea(y, lineHeightPx);

      if (fnt.widthOfTextAtSize(test, size) <= curMaxW) {
        line = test;
      } else {
        if (line) pushLine(line);
        line = w;
      }
      if (y < margin) {
        page = pdfDoc.addPage();
        drawBorder(page);
        y = height - margin;
      }
    }
    if (line) pushLine(line);
  };

  drawWrappedTitle(story.story_title, fontBold, titleSize, 1.1, rgb(0.1, 0.2, 0.6));
  y -= 10;

  // Draw horizontal line respecting image overlap
  const drawHorizontalLine = () => {
    const { xPos, maxW } = getTextArea(y, 1);
    page.drawLine({
      start: { x: xPos, y },
      end: { x: xPos + maxW, y },
      thickness: 1,
      color: rgb(0.4, 0.4, 0.7),
    });
  };

  drawHorizontalLine();
  y -= 20;

  // Draw Genre and Read Time respecting image overlap
  const { xPos: metaX } = getTextArea(y, textSize);
  page.drawText('Genre:', {
    x: metaX,
    y,
    size: textSize,
    font: fontBold,
    color: rgb(0.4, 0.4, 0.4),
  });
  page.drawText(story.genre, {
    x: metaX + 45,
    y,
    size: textSize,
    font: fontItalic,
    color: rgb(0.2, 0.2, 0.2),
  });
  y -= textSize + 5;

  const { xPos: metaX2 } = getTextArea(y, textSize);
  page.drawText('Read Time:', {
    x: metaX2,
    y,
    size: textSize,
    font: fontBold,
    color: rgb(0.4, 0.4, 0.4),
  });
  page.drawText(story.read_time, {
    x: metaX2 + 65,
    y,
    size: textSize,
    font: fontItalic,
    color: rgb(0.2, 0.2, 0.2),
  });
  y -= textSize + 10;

  drawHorizontalLine();
  y -= 40;

  const wrapText = (text: string, maxW: number, size: number, font: PDFFont) => {
    const words = text.split(' ');
    const lines: string[] = [];
    let line = '';
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(test, size) <= maxW) {
        line = test;
      } else {
        if (line) lines.push(line);
        line = w;
      }
    }
    if (line) lines.push(line);
    return lines;
  };

  // Draw body paragraphs with wrapping that respects side images
  const drawParagraph = (raw: string) => {
    const cleanParagraph = raw.replace(/\r?\n/g, ' ').trim();
    const words = cleanParagraph.split(' ');
    let line = '';
    const lineHeightPx = textSize * lineHeight;

    const pushLine = (ln: string) => {
      const { xPos, maxW } = getTextArea(y, lineHeightPx);
      page.drawText(ln, {
        x: xPos,
        y,
        size: textSize,
        font: fontNormal,
        color: rgb(0, 0, 0),
        maxWidth: maxW,
      });
      y -= lineHeightPx;
    };

    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      const { maxW: curMaxW } = getTextArea(y, lineHeightPx);

      if (fontNormal.widthOfTextAtSize(test, textSize) <= curMaxW) {
        line = test;
      } else {
        if (line) pushLine(line);
        line = w;
      }

      if (y < margin) {
        page = pdfDoc.addPage();
        drawBorder(page);
        y = height - margin;
      }
    }
    if (line) pushLine(line);
    y -= textSize * 0.5;
  };

  for (const paragraph of story.enhanced_story.split(/\n\s*\n/).filter((p) => p.trim())) {
    drawParagraph(paragraph);
  }

  pdfDoc.getPages().forEach((p, idx) => {
    const num = `${idx + 1}`;
    p.drawText(num, {
      x: (width - fontNormal.widthOfTextAtSize(num, 10)) / 2,
      y: margin / 2,
      size: 10,
      font: fontNormal,
      color: rgb(0.5, 0.5, 0.5),
    });
  });

  return pdfDoc;
};

export const handleDownload = async (story: Story) => {
  const pdfDoc = await createStoryPDF(story);
  const pdfBytes = await pdfDoc.save();
  download(pdfBytes, `${story.story_title}.pdf`, 'application/pdf');
};

export const handlePrintPDF = async (story: Story) => {
  const pdfDoc = await createStoryPDF(story);
  const pdfBytes = await pdfDoc.save();
  const pdfBytesCopy = new Uint8Array(pdfBytes);
  const blob = new Blob([pdfBytesCopy], { type: 'application/pdf' });
const blobUrl = URL.createObjectURL(blob);

  const printWindow = window.open(blobUrl);

  printWindow?.addEventListener('load', () => {
    printWindow.focus();
    printWindow.print();
  });

  setTimeout(() => {
    printWindow?.focus();
    printWindow?.print();
  }, 1000);
};
