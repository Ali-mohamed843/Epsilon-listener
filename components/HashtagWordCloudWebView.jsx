import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';

const BRAND = '#6e226e';

const HashtagWordCloudWebView = ({ hashtags = [], height = 400, onHashtagPress, showHash }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedHashtag, setSelectedHashtag] = useState(null);
  const router = useRouter();

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleReset = () => setZoomLevel(1);

  const processedHashtags = useMemo(() => {
    if (!hashtags || hashtags.length === 0) return [];
    return hashtags.map((tag) => {
      const name = typeof tag === 'string' ? tag : (tag.name || '');
      const contentCount = tag.platformContents?.length || 1;
      return {
        text: name,
        size: contentCount,
        id: tag.id || name,
        platformContents: tag.platformContents || [],
        originalTag: tag,
      };
    });
  }, [hashtags]);

  const handleHashtagClick = (tag) => {
    setSelectedHashtag(tag);
    if (onHashtagPress) {
      onHashtagPress(tag.originalTag || tag);
    } else if (showHash && tag.id) {
      router.push({
        pathname: '/pages/hashtag-detail/[id]',
        params: {
          id: tag.id,
          hash: showHash,
          hashtagName: tag.text,
        },
      });
    }
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.zoom) {
        setZoomLevel(Math.round(data.zoom * 100) / 100);
      }
      if (data.hashtagClicked) {
        const clickedTag = processedHashtags.find(
          (h) => h.text === data.hashtagClicked || String(h.id) === String(data.hashtagId)
        );
        if (clickedTag) {
          handleHashtagClick(clickedTag);
        }
      }
    } catch (e) {
      console.error('WebView message error:', e);
    }
  };

  const buildHtml = (wordList, zoom) => {
    if (wordList.length === 0) {
      return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/><style>body{display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#fff;}</style></head><body><div style="color:#9e859e;font-size:14px;">No hashtags found</div></body></html>`;
    }
    const maxVal = Math.max(...wordList.map(w => w.size), 1);
    const minVal = Math.min(...wordList.map(w => w.size), 1);
    const wordsWithSizes = wordList.map((w) => {
      const ratio = maxVal === minVal ? 0.5 : (w.size - minVal) / (maxVal - minVal);
      const fontSize = Math.round(10 + ratio * 18);
      const fontWeight = ratio > 0.7 ? 800 : ratio > 0.4 ? 700 : 600;
      const r = Math.round(52 - ratio * 48);
      const g = Math.round(211 - ratio * 90);
      const b = Math.round(153 - ratio * 66);
      return { text: w.text, fontSize, fontWeight, color: `rgb(${r},${g},${b})`, id: w.id, hasLinks: w.platformContents && w.platformContents.length > 0, linkCount: w.platformContents?.length || 0 };
    });
    const shuffledWords = [...wordsWithSizes].sort(() => Math.random() - 0.5);
    const wordsHtml = shuffledWords.map((w) => `<span class="hashtag" data-id="${w.id}" data-text="${w.text.replace(/"/g, '&quot;')}" data-links="${w.hasLinks}" data-count="${w.linkCount}" style="font-size:${w.fontSize}px;font-weight:${w.fontWeight};color:${w.color};padding:${Math.max(4, w.fontSize * 0.2)}px ${Math.max(6, w.fontSize * 0.3)}px;display:inline-block;cursor:pointer;transition:transform 0.15s ease,opacity 0.15s ease;line-height:1.3;">${w.text}</span>`).join('');
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/><style>*{margin:0;padding:0;box-sizing:border-box;}html,body{width:100%;height:100%;background:#ffffff;overflow:hidden;touch-action:none;}#wrapper{width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch;}#cloud{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;align-content:center;padding:16px;min-height:100%;transform-origin:center center;transition:transform 0.1s ease;}.hashtag{user-select:none;-webkit-user-select:none;white-space:nowrap;}.hashtag:active{transform:scale(0.95);opacity:0.7;}</style></head><body><div id="wrapper"><div id="cloud">${wordsHtml}</div></div><script>const cloud=document.getElementById('cloud');let scale=${zoom};document.querySelectorAll('.hashtag').forEach(el=>{el.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();const text=this.getAttribute('data-text');const id=this.getAttribute('data-id');const hasLinks=this.getAttribute('data-links')==='true';const linkCount=parseInt(this.getAttribute('data-count')||'0');if(window.ReactNativeWebView){window.ReactNativeWebView.postMessage(JSON.stringify({hashtagClicked:text,hashtagId:id,hasLinks:hasLinks,linkCount:linkCount}));}});el.addEventListener('touchstart',function(){this.style.transform='scale(0.95)';this.style.opacity='0.7';},{passive:true});el.addEventListener('touchend',function(){this.style.transform='scale(1)';this.style.opacity='1';},{passive:true});});let pinchStartDist=0;let pinchStartScale=1;function getDist(t){const dx=t[0].clientX-t[1].clientX;const dy=t[0].clientY-t[1].clientY;return Math.sqrt(dx*dx+dy*dy);}function applyZoom(){cloud.style.transform='scale('+scale+')';}document.addEventListener('touchstart',function(e){if(e.touches.length===2){e.preventDefault();pinchStartDist=getDist(e.touches);pinchStartScale=scale;}},{passive:false});document.addEventListener('touchmove',function(e){if(e.touches.length===2){e.preventDefault();const dist=getDist(e.touches);const ratio=dist/pinchStartDist;scale=Math.min(Math.max(pinchStartScale*ratio,0.5),3);applyZoom();}},{passive:false});document.addEventListener('touchend',function(e){if(e.touches.length<2){if(window.ReactNativeWebView){window.ReactNativeWebView.postMessage(JSON.stringify({zoom:scale}));}}});applyZoom();</script></body></html>`;
  };

  const cloudHtml = useMemo(() => buildHtml(processedHashtags, zoomLevel), [processedHashtags, zoomLevel]);
  const dynamicHeight = Math.max(height, Math.min(600, 150 + hashtags.length * 3));
  const cloudHeight = dynamicHeight - 60;
  const ZoomInIcon = () => <Text style={{ fontSize: 16, color: BRAND, fontWeight: '700' }}>+</Text>;
  const ZoomOutIcon = () => <Text style={{ fontSize: 16, color: BRAND, fontWeight: '700' }}>−</Text>;
  const ResetIcon = () => <Text style={{ fontSize: 12, color: BRAND }}>↻</Text>;

  if (!hashtags || hashtags.length === 0) {
    return (
      <View style={{ backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16, height: 120, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#9e859e', fontSize: 14 }}>No hashtags found</Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#1e293b' }}>Hashtags</Text>
          <View style={{ backgroundColor: '#e6f9f4', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#047857' }}>{hashtags.length} tags</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <TouchableOpacity onPress={handleZoomOut} activeOpacity={0.7} style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: zoomLevel <= 0.5 ? '#f1f5f9' : '#6e226e10', alignItems: 'center', justifyContent: 'center', opacity: zoomLevel <= 0.5 ? 0.4 : 1 }} disabled={zoomLevel <= 0.5}>
            <ZoomOutIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReset} activeOpacity={0.7} style={{ paddingHorizontal: 8, height: 32, borderRadius: 8, backgroundColor: zoomLevel === 1 ? '#f1f5f9' : '#6e226e10', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
            <ResetIcon />
            <Text style={{ fontSize: 11, fontWeight: '600', color: zoomLevel === 1 ? '#94A3B8' : BRAND, marginLeft: 4 }}>{Math.round(zoomLevel * 100)}%</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleZoomIn} activeOpacity={0.7} style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: zoomLevel >= 3 ? '#f1f5f9' : '#6e226e10', alignItems: 'center', justifyContent: 'center', opacity: zoomLevel >= 3 ? 0.4 : 1 }} disabled={zoomLevel >= 3}>
            <ZoomInIcon />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ height: cloudHeight }}>
        <WebView key={`hashtag-cloud-${zoomLevel}`} source={{ html: cloudHtml }} style={{ flex: 1, backgroundColor: 'transparent' }} scrollEnabled={true} scalesPageToFit={false} showsVerticalScrollIndicator={true} showsHorizontalScrollIndicator={false} originWhitelist={['*']} javaScriptEnabled onMessage={handleWebViewMessage} nestedScrollEnabled={true} />
      </View>
      {selectedHashtag && (
        <View style={{ backgroundColor: '#f0fdf4', padding: 12, borderTopWidth: 1, borderTopColor: '#d1fae5', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#047857' }}>{selectedHashtag.text}</Text>
          </View>
          <TouchableOpacity onPress={() => setSelectedHashtag(null)} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#dcfce7', borderRadius: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#047857' }}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default HashtagWordCloudWebView;