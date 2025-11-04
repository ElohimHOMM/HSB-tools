$(async function () {
    const saveManager = new SaveManager('list.enigma');
    let data = await saveManager.loadData();

    document.querySelectorAll('.enigma-checkbox').forEach((box) => {
        const id = box.dataset.id;
        box.checked = !!data[id];
    });

    document.querySelectorAll('.enigma-checkbox').forEach((box) => {
        box.addEventListener('change', async () => {
            data[box.dataset.id] = box.checked;
            await saveManager.saveData(data);
        });
    });
});