javascript:(function() {
    const createModalContainer = () => {
        const existingModal = document.getElementById('matchModal');
        if (existingModal) {
            existingModal.remove();
        }

        modalContainer = document.createElement('div');
        modalContainer.id = 'matchModal';
        modalContainer.style.display = 'none';
        document.body.appendChild(modalContainer);
    };

    createModalContainer();

    const showModal = (content) => {
        modalContainer.innerHTML = `
            <div style="width: 70%; max-width: 800px; height: fit-content; max-height: 80%; background: rgba(255, 255, 255, 0.9); margin: 20px 15px; padding: 15px 15px 0 15px; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 99999; overflow-y: auto; box-shadow: rgba(68, 68, 68, 0.12) 5px 5px 5px 0px; font-size: 13px; color: #444; border-radius: 15px; line-height: 19px;">
                <span style="cursor: pointer; position: absolute; top: 15px; right: 15px; font-size: 18px; font-weight: bold" onclick="closeModal()">×</span>
                ${content}
            </div>
        `;

        modalContainer.style.display = 'block';
    };

    window.closeModal = () => {
        modalContainer.style.display = 'none';
    };

    function extractSupTags() {
        let supTags = document.querySelectorAll('sup');
        let supWithParent = Array.from(supTags).map(function(supTag) {
            let supText = supTag.textContent.trim(); 
            return {
                supText: supText,
                parentTag: supTag.parentNode.outerHTML
            };
        });
        return supWithParent;
    };

    function matchTags() {
        let lis = document.querySelectorAll('section.ac-gf-sosumi li');
        let supTags = extractSupTags();
        let results = [];
        lis.forEach(function(li) {
            let liId = li.getAttribute('id');
            let liText = li.innerHTML;
            let matchedSupTags = supTags.filter(function(supTag) {
                return supTag.parentTag.includes('href="#' + liId + '"');
            });
            results.push({ liText: liText, supTags: matchedSupTags });
        });
        let tableContent = generateTableContent(results);
        showModal(tableContent);
    };

    document.querySelectorAll('#matchModal td').forEach(element => {
        element.removeAttribute('style');
    });

    function generateTableContent(results) {
        const modalStyles = `
        #matchModal table p, #matchModal table span, #matchModal table strong, #matchModal table figure, #matchModal table h1, #matchModal table h2, #matchModal table h3, #matchModal table h4, #matchModal table h5, #matchModal table h6, #matchModal table div, #matchModal table li {
            font-size: 13px !important; color: #333 !important; opacity: 1 !important; display: block !important; transform: none !important; pointer-events: none !important; position: relative !important; top: 0; left: 0; bottom: 0; right: 0; margin: 0; padding: 0; line-height: 19px; list-style: none !important;
        }
        #matchModal table p, #matchModal table span, #matchModal table figure, #matchModal table h1, #matchModal table h2, #matchModal table h3, #matchModal table h4, #matchModal table h5, #matchModal table h6, #matchModal table div {
            font-weight: 400 !important;
        }
    `;

    return `
        <style>${modalStyles}</style>
            <table style="width: 100%; margin-top: 10px; margin-bottom: 20px;">
                <h3 style="font-size: 20px; color: #333; font-weight: 600">Matched Footnotes</h3>
                <tr>
                    <th style="color: #333; font-weight: 600; font-size: 16px; background-color: #cddafd; text-align: center; border-right: 1px solid #c2c2c2; padding: 4px 0;">Legal</th>
                    <th style="color: #333; font-weight: 600; font-size: 16px; background-color: #cddafd; text-align: center; padding: 4px 0;">&lt;sup&gt; tags</th>
                </tr>
                ${results.map(match => `
                    <tr style="border-bottom: 1px solid #c2c2c2; width: 100%;">
                        <td style="padding-right: 10px; border-right: 1px solid #c2c2c2; width: 50%; vertical-align: top;">${match.supTags.length > 0 ? match.supTags[0].supText + '.' : ''} ${match.liText}</td>
                        <td style="width: 46%; vertical-align: top;">
                            <table style="width: 100%;">
                                ${match.supTags.map((sup, index) => `
                                    <tr>
                                        <td style="padding-left: 5px; border-bottom: 1px solid #c2c2c2; ${index === match.supTags.length - 1 ? 'border-bottom: none;' : ''}">${sup.parentTag}</td>
                                    </tr>
                                `).join('')}
                            </table>
                        </td>
                    </tr>
                `).join('')}
            </table>
        `;
    };

    matchTags();
})();